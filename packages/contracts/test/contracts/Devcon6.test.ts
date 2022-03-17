import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { configuredDevcon6Fixture, devcon6Fixture, minBidIncrement, reservePrice } from 'fixtures/devcon6Fixture'
import { Devcon6 } from 'contracts'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { Provider } from '@ethersproject/providers'
import { HOUR, MINUTE } from 'utils/consts'
import { network } from 'hardhat'
import { BigNumber, BigNumberish, Wallet, utils, ContractTransaction } from 'ethers'
import { State } from './state'
import { WinType } from './winType'
import { bigNumberArrayFrom, randomBigNumbers } from 'utils/bigNumber'
import { Bid } from './bid'

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

    it('tree test', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 4 })))
      devconAsOwner = devcon.connect(wallets[1])

      await expect(devcon.bid({ value: reservePrice.add(100) })).to.be.not.reverted
      await bidAsWallet(wallets[2], reservePrice.add(20))
      await bidAsWallet(wallets[3], reservePrice.add(10))
      await bidAsWallet(wallets[4], reservePrice.add(30))

      await verifySmallestValue(reservePrice.add(10))
      await verifyBiggestValue(reservePrice.add(100))

      // update values
      await bidAsWallet(wallets[3], reservePrice)
      await verifyBiggestValue(reservePrice.add(10).add(reservePrice))
      await verifySmallestValue(reservePrice.add(20))

      // less than minimum
      await bidAsWallet(wallets[5], reservePrice.add(15))
      await verifyBiggestValue(reservePrice.add(10).add(reservePrice))
      await verifySmallestValue(reservePrice.add(20))

      // new bid greater than minimum
      await bidAsWallet(wallets[6], reservePrice.add(25))
      await verifyBiggestValue(reservePrice.add(10).add(reservePrice))
      await verifySmallestValue(reservePrice.add(25))
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
      await expect(devcon.settleAuction())
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

    it('tree test', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 20 })))
      devconAsOwner = devcon.connect(wallets[1])

      // await bidAsWallet(wallets[1], reservePrice.add(100))
      // await bidAsWallet(wallets[2], reservePrice.add(20))
      // await bidAsWallet(wallets[3], reservePrice.add(10))
      // await bidAsWallet(wallets[4], reservePrice.add(30))
      // await bidAsWallet(wallets[5], reservePrice.add(130))
      // await bidAsWallet(wallets[6], reservePrice.add(70))
      // await bidAsWallet(wallets[7], reservePrice.add(135))
      // await bidAsWallet(wallets[8], reservePrice.add(111))
      // await bidAsWallet(wallets[9], reservePrice.add(40))
      // await bidAsWallet(wallets[10], reservePrice.add(20))

      await bidRandom(600)
      // // from highest bid to lowest: 7,5,8,1
      // console.log("After bidRandom")
      //
      await endBidding(devconAsOwner)
      await settleAuction([3, 2])

      // await verifyBiggestValue(reservePrice.add(135))
      // expect(await devcon.getAuctionWinners()).to.deep.eq(bigNumberArrayFrom([7,5]))
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
      await devconAsOwner.settleAuction()

      await expect(devcon.claim(4))
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('reverts if bidder does not exist', async function () {
      await bidAndSettleRaffle(2, [1])

      await expect(devcon.claim(20))
        .to.be.revertedWith('Devcon6: given bidder does not exist')
    })

    it('reverts if funds have been already claimed', async function () {
      await bidAndSettleRaffle(4, [1])

      await devcon.claim(4)
      await expect(devcon.claim(4))
        .to.be.revertedWith('Devcon6: funds have been already claimed')
    })

    it('reverts if auction winner wants to claim funds', async function () {
      await bidAndSettleRaffle(9, [1])

      await expect(devcon.claim(1))
        .to.be.revertedWith('Devcon6: auction winners cannot claim funds')
    })

    it('sets bid as claimed', async function () {
      await bidAndSettleRaffle(5, [2])

      await devconAsOwner.claim(1)

      const bid = await getBidByID(1)
      expect(bid.claimed).to.be.true
    })

    it('transfers remaining funds for raffle winner', async function () {
      const bidder = wallets[5]
      const remainingFunds = utils.parseEther('0.6')
      await bidAsWallet(bidder, reservePrice.add(remainingFunds))
      await bidAndSettleRaffle(5, [2])

      const bidderBalanceBeforeClaim = await bidder.getBalance()
      await devconAsOwner.claim(1)

      expect(await bidder.getBalance()).to.be.equal(bidderBalanceBeforeClaim.add(remainingFunds))
    })

    it('transfers bid funds for golden ticket winner', async function () {
      await bidAndSettleRaffle(10, [2])

      const wonBid = await getBidByWinType(10, WinType.goldenTicket)

      const bidderAddress = await devconAsOwner.getBidderAddress(wonBid.bidderID)
      const bidderBalance = await provider.getBalance(bidderAddress)
      const expectedBidderBalance = bidderBalance.add(wonBid.amount)

      await devconAsOwner.claim(wonBid.bidderID)

      expect(await provider.getBalance(bidderAddress)).to.be.equal(expectedBidderBalance)
    })

    it('transfers bid funds for loser', async function () {
      await bidAndSettleRaffle(10, [2])

      const lostBid = await getBidByWinType(10, WinType.loss)

      const bidderAddress = await devconAsOwner.getBidderAddress(lostBid.bidderID)
      const bidderBalance = await provider.getBalance(bidderAddress)
      const expectedBidderBalance = bidderBalance.add(reservePrice)

      await devconAsOwner.claim(lostBid.bidderID)

      expect(await provider.getBalance(bidderAddress)).to.be.equal(expectedBidderBalance)
    })

    async function getBidByWinType(bidCount: number, winType: WinType): Promise<Bid> {
      let bid: Bid
      for (let i = 1; i < bidCount + 1; i++) {
        const currentBid = await getBidByID(i)
        if (currentBid.winType === winType) {
          bid = currentBid
        }
      }
      expect(bid.bidderID).to.not.equal(0)
      return bid
    }
  })

  describe('claimProceeds', function () {
    it('reverts if called not by owner', async function () {
      await expect(devcon.claimProceeds())
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts if proceeds have been already claimed', async function () {
      await bidAndSettleRaffle(2, [1])
      await devconAsOwner.claimProceeds()

      await expect(devconAsOwner.claimProceeds())
        .to.be.revertedWith('Devcon6: proceeds has been already claimed')
    })

    it('transfers correct amount', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 2, raffleWinnersCount: 8 })))
      devconAsOwner = devcon.connect(wallets[1])

      const auctionBidAmount = reservePrice.add(100)
      await bidAsWallet(wallets[8], auctionBidAmount)
      await bidAsWallet(wallets[9], auctionBidAmount)
      await bidAndSettleRaffle(8, [1, 2])

      const balanceBeforeClaim = await wallets[1].getBalance()
      const tx = await devconAsOwner.claimProceeds()
      const txCost = await calculateTxCost(tx)

      const claimAmount = auctionBidAmount.mul(2).add(reservePrice.mul(7))
      expect(await wallets[1].getBalance()).to.be.equal(balanceBeforeClaim.add(claimAmount).sub(txCost))
    })

    it('transfers correct amount when there are not enough participants for entire auction', async function () {
      await bidAndSettleRaffle(5, [])

      const balanceBeforeClaim = await wallets[1].getBalance()
      const tx = await devconAsOwner.claimProceeds()
      const txCost = await calculateTxCost(tx)

      const claimAmount = reservePrice.mul(4)
      expect(await wallets[1].getBalance()).to.be.equal(balanceBeforeClaim.add(claimAmount).sub(txCost))
    })

    it('does not transfer funds if there are no participants', async function () {
      await bidAndSettleRaffle(0, [])

      const balanceBeforeClaim = await wallets[1].getBalance()
      const tx = await devconAsOwner.claimProceeds()
      const txCost = await calculateTxCost(tx)

      expect(await wallets[1].getBalance()).to.be.equal(balanceBeforeClaim.sub(txCost))
    })
  })

  describe('withdrawUnclaimedFunds', function () {
    it('reverts if called not by owner', async function () {
      await expect(devcon.withdrawUnclaimedFunds())
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts if claiming has not been closed yet', async function () {
      await bidAndSettleRaffle(2, [1])

      await expect(devconAsOwner.withdrawUnclaimedFunds())
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('transfers unclaimed funds', async function () {
      await bidAndSettleRaffle(10, [1])
      await devconAsOwner.claimProceeds()

      const endTime = await devcon.claimingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])

      const balanceBeforeWithdraw = await wallets[1].getBalance()
      const tx = await devconAsOwner.withdrawUnclaimedFunds()
      const txCost = await calculateTxCost(tx)

      const expectedBalance = balanceBeforeWithdraw
        .sub(txCost)
        .add(reservePrice.mul(2)) // unclaimed golden ticket and non-winning bid funds
      expect(await wallets[1].getBalance()).to.be.equal(expectedBalance)
    })
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

  async function bidAndSettleRaffle(bidCount: number, auctionWinners: number[]) {
    await bid(bidCount)
    await endBidding(devconAsOwner)
    await devconAsOwner.settleAuction()
    await devconAsOwner.settleRaffle(randomBigNumbers(1))
  }

  async function endBidding(devcon: Devcon6) {
    const endTime = await devcon.biddingEndTime()
    await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
    await network.provider.send('evm_mine')
  }

  async function settleAuction(auctionWinners: BigNumberish[]) {
    await devconAsOwner.settleAuction({ gasLimit: 4_000_000 })
  }

  async function bid(bidAmount: number) {
    for (let i = 0; i < bidAmount; i++) {
      await bidAsWallet(wallets[i], reservePrice)
    }
  }

  async function bidRandom(bidAmount: number) {
    for (let i = 0; i < bidAmount; i++) {
      await bidAsWallet(wallets[i], randomBN())
    }
  }

  function randomBN(): BigNumber {
    return BigNumber.from(utils.randomBytes(4)).add(reservePrice)
  }

  async function bidAsWallet(wallet: Wallet, value: BigNumberish) {
    await devcon.connect(wallet).bid({ value: value, gasLimit: 600_000 })
  }

  async function getBidByID(bidID: number): Promise<Bid> {
    const bidderAddress = await devconAsOwner.getBidderAddress(bidID)
    return devconAsOwner.getBid(bidderAddress)
  }

  async function calculateTxCost(tx: ContractTransaction): Promise<BigNumber> {
    const txReceipt = await tx.wait()
    return txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)
  }

  // tree function helpers
  async function verifyBiggestValue(expected: BigNumberish) {
    const biggestValue = await devcon.biggestBid()
    console.log('\nBiggest bid:')
    const bidAmount = treeNodeToBidderInfo(biggestValue)
    expect(bidAmount).to.be.equal(expected)
  }

  async function verifySmallestValue(expected: BigNumberish) {
    const smallestValue = await devcon.smallestBid()
    console.log('\nSmallest bid:')
    const bidAmount = treeNodeToBidderInfo(smallestValue)
    expect(bidAmount).to.be.equal(expected)
  }

  function treeNodeToBidderInfo(value: BigNumber): BigNumber {
    const mask = BigNumber.from('0xffff') // decimal from 0xffff
    const bidderID = mask.sub(value.and(mask))
    console.log('BidderID: ', bidderID.toString())
    const bidAmount = value.shr(16)
    console.log('BidAmount: ', bidAmount.toString())
    return bidAmount
  }
})
