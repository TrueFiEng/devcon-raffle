import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { configuredDevcon6Fixture, devcon6Fixture, minBidIncrement, reservePrice } from 'fixtures/devcon6Fixture'
import { Devcon6 } from 'contracts'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { Provider } from '@ethersproject/providers'
import { HOUR, MINUTE } from 'utils/consts'
import { network } from 'hardhat'
import { BigNumber, BigNumberish, Wallet, utils } from 'ethers'
import { State } from './state'
import { WinType } from './winType'
import { bigNumberArrayFrom, randomBigNumbers } from 'utils/bigNumber'
import { describe } from 'mocha'

describe('Devcon6', function () {
  const loadFixture = setupFixtureLoader()

  let provider: Provider
  let devcon: Devcon6
  let devconAsOwner: Devcon6
  let bidderAddress: string
  let wallets: Wallet[]

  beforeEach(async function () {
    ({ provider, devcon, wallets } = await loadFixture(devcon6Fixture))
    devconAsOwner = devcon.connect(wallets[1])
    bidderAddress = await devcon.signer.getAddress()
  })

  describe('bid', function () {
    it('reverts if bidding is not opened yet', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ biddingStartTime: currentTime + MINUTE })))

      await expect(devcon.bid()).to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('reverts if bidding is already closed', async function () {
      const endTime = await devcon.biddingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])

      await expect(devcon.bid()).to.be.revertedWith('Devcon6: is in invalid state')
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

      expect(bid.bidderID).to.be.equal(1)
      expect(bid.amount).to.be.equal(reservePrice)
      expect(bid.winType).to.be.equal(WinType.loss)
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

    it('increases bidders count', async function () {
      await devcon.bid({ value: reservePrice })

      expect(await devcon.getBiddersCount()).to.be.equal(1)
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
      await bid(9)
    })

    it('reverts if called not by owner', async function () {
      await expect(devcon.settleAuction([1]))
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts if bidding is in progress', async function () {
      await expect(settleAuction([1]))
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('reverts if called twice', async function () {
      await endBidding(devconAsOwner)
      await settleAuction([1])
      await expect(settleAuction([1]))
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('changes state if amount of bidders is less than auctionWinnersCount', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ raffleWinnersCount: 80 })))
      devconAsOwner = devcon.connect(wallets[1])

      await endBidding(devconAsOwner)
      await settleAuction([])

      expect(await devconAsOwner.getState()).to.be.equal(State.auctionSettled)
    })

    it('chooses auction winners when there is not enough participants for entire auction', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 5 })))
      devconAsOwner = devcon.connect(wallets[1])

      await bid(9)

      await endBidding(devconAsOwner)
      await settleAuction([1])

      const auctionWinnerBid = await getBidByID(1)
      expect(auctionWinnerBid.winType).to.deep.equal(WinType.auction)
    })

    it('reverts if passed auction winners array length is less than auctionWinnersCount', async function () {
      await endBidding(devconAsOwner)
      await expect(settleAuction([]))
        .to.be.revertedWith('Devcon6: invalid auction winners length')
    })

    it('reverts if winner does not exist', async function () {
      await endBidding(devconAsOwner)
      await expect(settleAuction([30]))
        .to.be.revertedWith('Devcon6: given winner does not exist')
    })

    it('saves auction winners', async function () {
      await endBidding(devconAsOwner)

      await settleAuction([2])

      const bid = await getBidByID(2)
      expect(bid.winType).to.deep.equal(WinType.auction)
    })

    it('removes winners from raffle participants', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 2 })))
      devconAsOwner = devcon.connect(wallets[1])

      await bid(10)

      await endBidding(devconAsOwner)
      await settleAuction([3, 2])

      expect(await devcon.getRaffleParticipants()).to.deep.eq(bigNumberArrayFrom([1, 9, 10, 4, 5, 6, 7, 8]))
    })
  })

  describe('settleRaffle', function () {
    beforeEach(async function () {
      await bid(9)
    })

    it('reverts if called not by owner', async function () {
      await expect(devcon.settleRaffle([1]))
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts if raffle is not settled', async function () {
      await expect(devconAsOwner.settleRaffle([1]))
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('picks all participants as winners if amount of bidders is less than raffleWinnersCount', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ raffleWinnersCount: 16 })))
      devconAsOwner = devcon.connect(wallets[1])

      await bid(3)

      await endBidding(devconAsOwner)
      await settleAuction([])

      await devconAsOwner.settleRaffle(randomBigNumbers(2))

      for (let i = 1; i <= 3; i++) {
        const bid = await getBidByID(i)
        expect(bid.winType).to.be.eq(WinType.raffle)
      }
    })

    it('selects random winners', async function () {
      await bid(20)

      await endBidding(devconAsOwner)
      await settleAuction([1])

      // Participant indexes generated from this number: [16, 16, 6, 7, 4, 9, 0, 1]
      const randomNumber = BigNumber.from('112726022748934390014388827089462711312944969753614146584009694773482609536945')

      await devconAsOwner.settleRaffle([randomNumber])

      const winnersBidderIDs = [17, 19, 7, 8, 5, 10, 20, 2]
      for (let i = 0; i < winnersBidderIDs.length; i++) {
        const winningBid = await getBidByID(winnersBidderIDs[i])
        if (i === 0) {
          expect(winningBid.winType).to.be.eq(WinType.goldenTicket)
          continue
        }
        expect(winningBid.winType).to.be.eq(WinType.raffle)
      }
    })
  })

  describe('claim', function () {
    it('reverts if settling is not finished yet', async function () {
      await endBidding(devconAsOwner)
      await devconAsOwner.settleAuction([1])

      await expect(devcon.claim(4))
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('reverts if bidder does not exist', async function () {
      await bidAndSettleRaffle(2, [1])

      await expect(devcon.claim(20))
        .to.be.revertedWith('Devcon6: given bidder does not exist')
    })

    it('reverts if auction winner wants to claim funds', async function () {
      await bidAndSettleRaffle(9, [1])

      await expect(devcon.claim(1))
        .to.be.revertedWith('Devcon6: auction winners cannot claim funds')
    })

    it('reverts if funds have been already claimed', async function () {
      await bidAndSettleRaffle(4, [1])

      await devcon.claim(4)
      await expect(devcon.claim(4))
        .to.be.revertedWith('Devcon6: funds have been already claimed')
    })

    it('raffle winner claims remaining funds', async function () {
      const bidder = wallets[5]
      const remainingFunds = utils.parseEther('0.6')
      await bidAsWallet(bidder, reservePrice.add(remainingFunds))
      await bidAndSettleRaffle(5, [2])

      const bidderBalanceBeforeClaim = await bidder.getBalance()
      await devconAsOwner.claim(1)

      expect(await bidder.getBalance()).to.be.equal(bidderBalanceBeforeClaim.add(remainingFunds))
    })

    async function bidAndSettleRaffle(bidCount: number, auctionWinners: number[]) {
      await bid(bidCount)
      await endBidding(devconAsOwner)
      await devconAsOwner.settleAuction(auctionWinners)
      await devconAsOwner.settleRaffle(randomBigNumbers(1))
    }
  })

  describe('getState', function () {
    it('waiting for bidding', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ biddingStartTime: currentTime + MINUTE })))

      expect(await devcon.getState()).to.be.equal(State.awaitingBidding)
    })

    it('bidding open', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ biddingStartTime: currentTime - MINUTE })))

      expect(await devcon.getState()).to.be.equal(State.biddingOpen)
    })

    it('bidding closed', async function () {
      const endTime = await devcon.biddingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
      await network.provider.send('evm_mine')

      expect(await devcon.getState()).to.be.equal(State.biddingClosed)
    })

    // TODO rethink, after implementing `settleRaffle` whether test this here or in `settleAuction` tests
    it.skip('auction settled', async function () {
      expect(await devcon.getState()).to.be.equal(State.auctionSettled)
    })

    // TODO rethink, after implementing `settleRaffle` whether test this here or in `settleRaffle` tests
    it.skip('raffle settled', async function () {
      expect(await devcon.getState()).to.be.equal(State.raffleSettled)
    })

    it('claiming closed', async function () {
      const endTime = await devcon.claimingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
      await network.provider.send('evm_mine')

      expect(await devcon.getState()).to.be.equal(State.claimingClosed)
    })
  })

  async function endBidding(devcon: Devcon6) {
    const endTime = await devcon.biddingEndTime()
    await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
    await network.provider.send('evm_mine')
  }

  async function settleAuction(auctionWinners: BigNumberish[]) {
    await devconAsOwner.settleAuction(auctionWinners, { gasLimit: 500_000 })
  }

  async function bid(bidAmount: number) {
    for (let i = 0; i < bidAmount; i++) {
      await bidAsWallet(wallets[i], reservePrice)
    }
  }

  async function bidAsWallet(wallet: Wallet, value: BigNumberish) {
    await devcon.connect(wallet).bid({ value })
  }

  async function getBidByID(bidID: number) {
    const bidderAddress = await devconAsOwner.getBidderAddress(bidID)
    return devconAsOwner.getBid(bidderAddress)
  }
})
