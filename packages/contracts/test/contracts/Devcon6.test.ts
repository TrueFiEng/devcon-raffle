import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { devcon6Fixture, devcon6FixtureWithStartTime, minBidIncrement, reservePrice } from 'fixtures/devcon6Fixture'
import { Devcon6 } from 'contracts'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { Provider } from '@ethersproject/providers'
import { HOUR, MINUTE } from 'utils/consts'
import { network } from 'hardhat'
import { BigNumber, Wallet } from 'ethers'
import { Status } from './status'

describe('Devcon6', function () {
  const loadFixture = setupFixtureLoader()

  let provider: Provider
  let devcon: Devcon6
  let devconAsOwner: Devcon6
  let bidderAddress: string

  beforeEach(async function () {
    let owner: Wallet
    ({ provider, devcon, other: owner } = await loadFixture(devcon6Fixture))
    devconAsOwner = devcon.connect(owner)
    bidderAddress = await devcon.signer.getAddress()
  })

  describe('bid', function () {
    it('reverts if bidding is not opened yet', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(devcon6FixtureWithStartTime(currentTime + MINUTE)))

      await expect(devcon.bid()).to.be.revertedWith('Devcon6: bidding is not open yet')
    })

    it('reverts if bidding is already closed', async function () {
      const endTime = await devcon.biddingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])

      await expect(devcon.bid()).to.be.revertedWith('Devcon6: bidding is already closed')
    })

    it('reverts if bid increase is too low', async function () {
      await devcon.bid({ value: reservePrice })
      await expect(devcon.bid({ value: minBidIncrement.sub(100) }))
        .to.be.revertedWith('Devcon6: bid increment too low')
    })

    it('increases bid amount', async function () {
      await devcon.bid({ value: reservePrice })
      await expect(devcon.bid({ value: minBidIncrement })).to.be.not.reverted

      const bid = await devcon.getBid(bidderAddress)
      expect(bid.amount).to.be.equal(reservePrice.add(minBidIncrement))
    })

    it('reverts if bidding amount is below reserve price', async function () {
      await expect(devcon.bid({ value: reservePrice.sub(100) }))
        .to.be.revertedWith('Devcon6: bidding amount is below reserve price')
    })

    it('saves bid', async function () {
      await expect(devcon.bid({ value: reservePrice })).to.be.not.reverted

      const bid = await devcon.getBid(bidderAddress)

      expect(bid.amount).to.be.equal(reservePrice)
      expect(bid.bidderID).to.be.equal(1)
    })

    it('saves bidder address', async function () {
      await devcon.bid({ value: reservePrice })

      const savedBidderAddress = await devcon.getBidderAddress(1)
      expect(savedBidderAddress).to.be.equal(bidderAddress)
    })

    it('saves bidder as raffle participant', async function () {
      await devcon.bid({ value: reservePrice })

      const raffleParticipants = await devcon.getRaffleParticipants()
      expect(raffleParticipants).to.deep.eq([BigNumber.from(1)])
    })

    it('increases bidder ID', async function () {
      await devcon.bid({ value: reservePrice })

      expect(await devcon.nextBidderID()).to.be.equal(2)
    })

    it('emits event on bid increase', async function () {
      await devcon.bid({ value: reservePrice })

      await expect(devcon.bid({ value: minBidIncrement }))
        .to.emit(devcon, 'NewBid')
        .withArgs(bidderAddress, 1, reservePrice.add(minBidIncrement))
    })

    it('emits event on bid', async function () {
      await expect(devcon.bid({ value: reservePrice }))
        .to.emit(devcon, 'NewBid')
        .withArgs(bidderAddress, 1, reservePrice)
    })
  })

  describe('settleAuction', function () {
    it('reverts if called not by owner', async function () {
      await expect(devcon.settleAuction([1]))
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts if bidding is in progress', async function () {
      await expect(devconAsOwner.settleAuction([1], customGasLimit))
        .to.be.revertedWith('Devcon6: settleAuction can only be called after bidding is closed')
    })

    it('reverts if winner does not exist', async function () {
      await endBidding(devconAsOwner)
      await expect(devconAsOwner.settleAuction([1], customGasLimit))
        .to.be.revertedWith('Devcon6: given winner does not exist')
    })

    it('reverts if called twice', async function () {
      await devcon.bid({ value: reservePrice })

      await endBidding(devconAsOwner)
      await devconAsOwner.settleAuction([1], customGasLimit)
      await expect(devconAsOwner.settleAuction([1], customGasLimit))
        .to.be.revertedWith('Devcon6: settleAuction can only be called after bidding is closed')
    })

    it('reverts if passed array of auction winners is empty', async function () {
      await endBidding(devconAsOwner)
      await expect(devconAsOwner.settleAuction([]))
        .to.be.revertedWith('Devcon6: passed array of auction winners is empty')
    })

    it('saves auction winners', async function () {
      await devcon.bid({ value: reservePrice })
      await devconAsOwner.bid({ value: reservePrice })

      await endBidding(devconAsOwner)

      const auctionWinners = [BigNumber.from(2)]
      await devconAsOwner.settleAuction(auctionWinners)

      expect(await devcon.getAuctionWinners()).to.deep.eq(auctionWinners)
    })

    async function endBidding(devcon: Devcon6) {
      const endTime = await devcon.biddingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
      await network.provider.send('evm_mine')
    }

    const customGasLimit = {
      gasLimit: 500_000,
    }
  })

  describe('getStatus', function () {
    it('pending', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(devcon6FixtureWithStartTime(currentTime + MINUTE)))

      expect(await devcon.getStatus()).to.be.equal(Status.pending)
    })

    it('bidding open', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(devcon6FixtureWithStartTime(currentTime - MINUTE)))

      expect(await devcon.getStatus()).to.be.equal(Status.biddingOpen)
    })

    it('bidding closed', async function () {
      const endTime = await devcon.biddingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
      await network.provider.send('evm_mine')

      expect(await devcon.getStatus()).to.be.equal(Status.biddingClosed)
    })

    it.skip('auction settled', async function () {
      expect(await devcon.getStatus()).to.be.equal(Status.auctionSettled)
    })

    it.skip('raffle settled', async function () {
      expect(await devcon.getStatus()).to.be.equal(Status.raffleSettled)
    })

    it('claiming closed', async function () {
      const endTime = await devcon.claimingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
      await network.provider.send('evm_mine')

      expect(await devcon.getStatus()).to.be.equal(Status.claimingClosed)
    })
  })
})
