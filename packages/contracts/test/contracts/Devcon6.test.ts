import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import {
  configuredDevcon6Fixture,
  devcon6Fixture,
  minBidIncrement,
  reservePrice,
} from 'fixtures/devcon6Fixture'
import { Devcon6 } from 'contracts'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { Provider } from '@ethersproject/providers'
import { HOUR, MINUTE } from 'utils/consts'
import { network } from 'hardhat'
import { BigNumber, BigNumberish, Wallet } from 'ethers'
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
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ biddingStartTime: currentTime + MINUTE })))

      await expect(devcon.bid()).to.be.revertedWith('Devcon6: is not in bidding open state')
    })

    it('reverts if bidding is already closed', async function () {
      const endTime = await devcon.biddingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])

      await expect(devcon.bid()).to.be.revertedWith('Devcon6: is not in bidding open state')
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

      expect(await devcon.getRaffleParticipants()).to.deep.eq([BigNumber.from(1)])
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
    beforeEach(async function () {
      await devcon.bid({ value: reservePrice })
      await devconAsOwner.bid({ value: reservePrice })
    })

    it('reverts if called not by owner', async function () {
      await expect(devcon.settleAuction([1]))
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts if bidding is in progress', async function () {
      await expect(settleAuction([1]))
        .to.be.revertedWith('Devcon6: is not in bidding closed state')
    })

    it('reverts if called twice', async function () {
      await endBidding(devconAsOwner)
      await settleAuction([1])
      await expect(settleAuction([1]))
        .to.be.revertedWith('Devcon6: is not in bidding closed state')
    })

    it('changes status if amount of bidders is lower than auctionWinnersCount', async function () {
      let owner: Wallet
      ({ devcon, other: owner } = await loadFixture(configuredDevcon6Fixture({ raffleWinnersCount: 80 })))
      devconAsOwner = devcon.connect(owner)

      await endBidding(devconAsOwner)
      await settleAuction([])

      expect(await devconAsOwner.getStatus()).to.be.equal(Status.auctionSettled)
      expect(await devconAsOwner.getAuctionWinners()).to.deep.equal([])
    })

    it('reverts if passed auction winners array length is lower than auctionWinnersCount', async function () {
      await endBidding(devconAsOwner)
      await expect(settleAuction([]))
        .to.be.revertedWith('Devcon6: passed auction winners length does not match the preset length')
    })

    it('reverts if winner does not exist', async function () {
      await endBidding(devconAsOwner)
      await expect(settleAuction([5]))
        .to.be.revertedWith('Devcon6: given winner does not exist')
    })

    it('saves auction winners', async function () {
      await endBidding(devconAsOwner)

      const auctionWinners = [BigNumber.from(2)]
      await settleAuction(auctionWinners)

      expect(await devcon.getAuctionWinners()).to.deep.eq(auctionWinners)
    })

    it('removes winners from raffle participants', async function () {
      expect(await devcon.getRaffleParticipants()).to.deep.eq([BigNumber.from(1), BigNumber.from(2)])

      await endBidding(devconAsOwner)
      await settleAuction([BigNumber.from(2)])

      expect(await devcon.getRaffleParticipants()).to.deep.eq([BigNumber.from(1), BigNumber.from(0)])
    })

    async function endBidding(devcon: Devcon6) {
      const endTime = await devcon.biddingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
      await network.provider.send('evm_mine')
    }

    async function settleAuction(auctionWinners: BigNumberish[]) {
      await devconAsOwner.settleAuction(auctionWinners, { gasLimit: 500_000 })
    }
  })

  describe('getStatus', function () {
    it('pending', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ biddingStartTime: currentTime + MINUTE })))

      expect(await devcon.getStatus()).to.be.equal(Status.waitingForBidding)
    })

    it('bidding open', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ biddingStartTime: currentTime - MINUTE })))

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
