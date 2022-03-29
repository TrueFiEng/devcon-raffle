import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import {
  configuredDevcon6Fixture,
  devcon6Fixture,
  devcon6FixtureWithToken,
  minBidIncrement,
  reservePrice,
} from 'fixtures/devcon6Fixture'
import { Devcon6, ExampleToken } from 'contracts'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { Provider } from '@ethersproject/providers'
import { HOUR, MINUTE } from 'utils/consts'
import { network } from 'hardhat'
import { BigNumber, BigNumberish, ContractTransaction, Wallet } from 'ethers'
import { State } from './state'
import { WinType } from './winType'
import { bigNumberArrayFrom } from 'utils/bigNumber'
import { randomAddress } from 'utils/randomAddress'
import { Bid } from './bid'
import { parseEther } from 'ethers/lib/utils'
import { randomBigNumbers } from 'scripts/utils/random'

describe('Devcon6', function () {
  const loadFixture = setupFixtureLoader()

  let provider: Provider
  let devcon: Devcon6
  let devconAsOwner: Devcon6
  let bidderAddress: string
  let wallets: Wallet[]

  beforeEach(async function () {
    ({ provider, devcon, wallets } = await loadFixture(devcon6Fixture))
    devconAsOwner = devcon.connect(owner())
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
      await expect(devcon.settleAuction())
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts if bidding is in progress', async function () {
      await expect(settleAuction())
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('reverts if called twice', async function () {
      await endBidding(devconAsOwner)
      await settleAuction()
      await expect(settleAuction())
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('changes state if number of bidders is less than raffleWinnersCount', async function () {
      ({ devcon } = await loadFixture(devcon6Fixture))
      devconAsOwner = devcon.connect(owner())

      await bid(1)

      await endBidding(devconAsOwner)
      await settleAuction()

      expect(await devconAsOwner.getState()).to.be.equal(State.auctionSettled)
    })

    it('chooses auction winners when there are not enough participants for entire auction', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 5 })))
      devconAsOwner = devcon.connect(owner())

      await bid(9)

      await endBidding(devconAsOwner)
      await settleAuction()

      const auctionWinners = await getAllBidsByWinType(9, WinType.auction)
      expect(auctionWinners.length).to.equal(1)
    })

    it('saves auction winners', async function () {
      await endBidding(devconAsOwner)

      await settleAuction()

      const bid = await getBidByID(1)
      expect(bid.winType).to.deep.equal(WinType.auction)
    })

    it('removes winners from raffle participants', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 2 })))
      devconAsOwner = devcon.connect(owner())

      await bid(10)

      await endBidding(devconAsOwner)
      await settleAuction()

      expect(await devcon.getRaffleParticipants()).to.deep.eq(bigNumberArrayFrom([9, 10, 3, 4, 5, 6, 7, 8]))
    })

    it('emits events', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 2 })))
      devconAsOwner = devcon.connect(owner())

      await bid(10)
      await endBidding(devconAsOwner)

      const tx = await settleAuction()
      await emitsEvents(tx, 'NewAuctionWinner', [2], [1])
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

    it('reverts if called with zero random numbers', async function () {
      await endBidding(devconAsOwner)
      await settleAuction()

      await expect(devconAsOwner.settleRaffle([]))
        .to.be.revertedWith('Devcon6: there must be at least one random number passed')
    })

    it('reverts if called with incorrect amount of random numbers', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ raffleWinnersCount: 16 })))
      devconAsOwner = devcon.connect(owner())

      await bid(20)
      await endBidding(devconAsOwner)
      await settleAuction()

      // Reverts because it expects 2 random numbers
      await expect(devconAsOwner.settleRaffle(randomBigNumbers(3)))
        .to.be.revertedWith('Devcon6: passed incorrect number of random numbers')
    })

    it('picks all participants as winners if amount of bidders is less than raffleWinnersCount', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ raffleWinnersCount: 16 })))
      devconAsOwner = devcon.connect(owner())

      await bid(4)

      await endBidding(devconAsOwner)
      await settleAuction()

      // Golden ticket winner participant index generated from this number: 2, bidderID: 3
      const randomNumber = BigNumber.from('65155287986987035700835155359065462427392489128550609102552042044410661181326')
      await devconAsOwner.settleRaffle([randomNumber])

      for (let i = 1; i <= 4; i++) {
        const bid = await getBidByID(i)

        if (bid.bidderID.eq(3)) {
          expect(bid.winType).to.be.eq(WinType.goldenTicket)
        } else {
          expect(bid.winType).to.be.eq(WinType.raffle)
        }
      }
    })

    it('picks correct numbers of winners', async function () {
      await bid(10)
      await endBidding(devconAsOwner)
      await settleAuction()

      const randomNumber = BigNumber.from('65155287986987035700835155359065462427392489128550609102552042044410661181326')
      await devconAsOwner.settleRaffle([randomNumber])

      const winnersCounter = {
        raffleWinner: 0,
        goldenTicketWinner: 0,
      }
      for (let i = 1; i <= 10; i++) {
        const bid = await getBidByID(i)
        if (bid.winType === WinType.raffle) {
          winnersCounter.raffleWinner++
        } else if (bid.winType === WinType.goldenTicket) {
          winnersCounter.goldenTicketWinner++
        }
      }

      expect(winnersCounter.raffleWinner).to.be.equal(7)
      expect(winnersCounter.goldenTicketWinner).to.be.equal(1)
    })

    it('selects random winners', async function () {
      ({ devcon } = await loadFixture(configuredDevcon6Fixture({ raffleWinnersCount: 16 })))
      devconAsOwner = devcon.connect(owner())

      await bid(20)

      await endBidding(devconAsOwner)
      await settleAuction()

      // Participant indexes generated from this number:
      // [[16, 16, 6, 7, 4, 9, 0, 1], [6, 3, 6, 7, 1, 3, 2, 2]]
      const randomNumbers = [
        BigNumber.from('112726022748934390014388827089462711312944969753614146584009694773482609536945'),
        BigNumber.from('105047327762739474822912977776629330956455721538092382425528863739595553862604'),
      ]

      await devconAsOwner.settleRaffle(randomNumbers)

      const winnersBidderIDs = [17, 19, 7, 8, 5, 10, 20, 2, 18, 4, 14, 16, 12, 10, 3, 15]
      for (let i = 0; i < winnersBidderIDs.length; i++) {
        const winningBid = await getBidByID(winnersBidderIDs[i])
        if (i === 0) {
          expect(winningBid.winType).to.be.eq(WinType.goldenTicket)
          continue
        }
        expect(winningBid.winType).to.be.eq(WinType.raffle)
      }
    })

    it('works if there are no participants', async function () {
      ({ devcon } = await loadFixture(devcon6Fixture))
      devconAsOwner = devcon.connect(owner())

      await bidAndSettleRaffle(0)
    })

    it('changes state', async function () {
      await endBidding(devconAsOwner)

      await settleAuction()

      await devconAsOwner.settleRaffle(randomBigNumbers(1))

      expect(await devconAsOwner.getState()).to.be.eq(State.raffleSettled)
    })

    describe('when golden ticket winner has been selected', function () {
      it('emits event', async function () {
        const tx = await bidAndSettleRaffle(0)

        const goldenBid = await getBidByWinType(9, WinType.goldenTicket)
        await emitsEvents(tx, 'NewGoldenTicketWinner', [goldenBid.bidderID])
      })
    })

    describe('when raffle winners have been selected', function () {
      it('emits events', async function () {
        await endBidding(devconAsOwner)
        await settleAuction() // auction winner bidderID: 1

        // Golden ticket winner participant index generated from this number: 7, bidderID: 8
        const tx = await devconAsOwner.settleRaffle([7])

        const raffleWinners: number[][] = [[9]]
        for (let i = 2; i < 8; i++) {
          raffleWinners.push([i])
        }
        await emitsEvents(tx, 'NewRaffleWinner', ...raffleWinners)
      })
    })
  })

  describe('claim', function () {
    it('reverts if settling is not finished yet', async function () {
      await endBidding(devconAsOwner)
      await settleAuction()

      await expect(devcon.claim(4))
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('reverts if bidder does not exist', async function () {
      await bidAndSettleRaffle(2)

      await expect(devcon.claim(20))
        .to.be.revertedWith('Devcon6: bidder with given ID does not exist')
    })

    it('reverts if funds have been already claimed', async function () {
      await bidAndSettleRaffle(4)

      await devcon.claim(4)
      await expect(devcon.claim(4))
        .to.be.revertedWith('Devcon6: funds have already been claimed')
    })

    it('reverts if auction winner wants to claim funds', async function () {
      await bidAndSettleRaffle(9)

      await expect(devcon.claim(1))
        .to.be.revertedWith('Devcon6: auction winners cannot claim funds')
    })

    it('sets bid as claimed', async function () {
      await bidAndSettleRaffle(5)

      await devconAsOwner.claim(1)

      const bid = await getBidByID(1)
      expect(bid.claimed).to.be.true
    })

    it('transfers remaining funds for raffle winner', async function () {
      await bid(9) // place 9 bids = reservePrice
      await bidAsWallet(owner(), reservePrice) // bumps owner bid to become auction winner
      await bidAndSettleRaffle(9) // bumps all 9 bids
      const raffleBid = await getBidByWinType(9, WinType.raffle) // get any raffle winner
      const bidderAddress = await devconAsOwner.getBidderAddress(raffleBid.bidderID)

      const bidderBalanceBeforeClaim = await provider.getBalance(bidderAddress)
      await devconAsOwner.claim(raffleBid.bidderID)

      expect(await provider.getBalance(bidderAddress)).to.be.equal(bidderBalanceBeforeClaim.add(reservePrice))
    })

    it('transfers bid funds for golden ticket winner', async function () {
      await bidAsWallet(owner(), reservePrice)
      await bidAndSettleRaffle(10)

      const goldenBid = await getBidByWinType(10, WinType.goldenTicket)

      const bidderAddress = await devconAsOwner.getBidderAddress(goldenBid.bidderID)
      const bidderBalance = await provider.getBalance(bidderAddress)
      const expectedBidderBalance = bidderBalance.add(goldenBid.amount)

      await devconAsOwner.claim(goldenBid.bidderID)

      expect(await provider.getBalance(bidderAddress)).to.be.equal(expectedBidderBalance)
    })

    it('transfers bid funds for non-winning bidder', async function () {
      await bidAsWallet(owner(), reservePrice)
      await bidAndSettleRaffle(10)

      const lostBid = await getBidByWinType(10, WinType.loss)

      const bidderAddress = await devconAsOwner.getBidderAddress(lostBid.bidderID)
      const bidderBalance = await provider.getBalance(bidderAddress)
      const expectedBidderBalance = bidderBalance.add(reservePrice.mul(98).div(100))

      await devconAsOwner.claim(lostBid.bidderID)

      expect(await provider.getBalance(bidderAddress)).to.be.equal(expectedBidderBalance)
    })
  })

  describe('claimProceeds', function () {
    describe('when called not by owner', function () {
      it('reverts', async function () {
        await expect(devcon.claimProceeds())
          .to.be.revertedWith('Ownable: caller is not the owner')
      })
    })

    describe('when proceeds have already been claimed', function () {
      it('reverts', async function () {
        await bidAndSettleRaffle(2)
        await devconAsOwner.claimProceeds()

        await expect(devconAsOwner.claimProceeds())
          .to.be.revertedWith('Devcon6: proceeds have already been claimed')
      })
    })

    describe('when biddersCount > (auctionWinnersCount + raffleWinnersCount)', function () {
      it('transfers correct amount', async function () {
        const auctionBidAmount = reservePrice.add(100)
        await bidAsWallet(wallets[10], auctionBidAmount)
        await bidAndSettleRaffle(10)

        const claimAmount = auctionBidAmount.add(reservePrice.mul(7))
        expect(await claimProceeds()).to.eq(claimAmount)
      })
    })

    describe('when biddersCount == (auctionWinnersCount + raffleWinnersCount)', function () {
      it('transfers correct amount', async function () {
        ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 2, raffleWinnersCount: 8 })))
        devconAsOwner = devcon.connect(owner())

        const auctionBidAmount = reservePrice.add(100)
        await bidAsWallet(wallets[8], auctionBidAmount)
        await bidAsWallet(wallets[9], auctionBidAmount)
        await bidAndSettleRaffle(8)

        const claimAmount = auctionBidAmount.mul(2).add(reservePrice.mul(7))
        expect(await claimProceeds()).to.eq(claimAmount)
      })
    })

    describe('when raffleWinnersCount < biddersCount < (auctionWinnersCount + raffleWinnersCount)', function () {
      it('transfers correct amount', async function () {
        ({ devcon } = await loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 2, raffleWinnersCount: 8 })))
        devconAsOwner = devcon.connect(owner())

        const auctionBidAmount = reservePrice.add(100)
        await bidAsWallet(wallets[8], auctionBidAmount)
        await bidAndSettleRaffle(8)

        const claimAmount = auctionBidAmount.add(reservePrice.mul(7))
        expect(await claimProceeds()).to.eq(claimAmount)
      })
    })

    describe('when biddersCount == raffleWinnersCount', function () {
      it('transfers correct amount', async function () {
        await bidAndSettleRaffle(8)

        const claimAmount = reservePrice.mul(7)
        expect(await claimProceeds()).to.eq(claimAmount)
      })
    })

    describe('when biddersCount < raffleWinnersCount', function () {
      it('transfers correct amount', async function () {
        await bidAndSettleRaffle(5)

        const claimAmount = reservePrice.mul(4)
        expect(await claimProceeds()).to.eq(claimAmount)
      })
    })

    describe('when biddersCount == 1', function () {
      it('does not transfer funds', async function () {
        await bidAndSettleRaffle(1)
        expect(await claimProceeds()).to.eq(0)
      })
    })

    describe('when biddersCount == 0', function () {
      it('does not transfer funds', async function () {
        await bidAndSettleRaffle(0)
        expect(await claimProceeds()).to.eq(0)
      })
    })

    // Returns amount transferred to owner by claimProceeds method
    async function claimProceeds(): Promise<BigNumber> {
      return calculateTransferredAmount(devconAsOwner.claimProceeds)
    }
  })

  describe('withdrawUnclaimedFunds', function () {
    it('reverts if called not by owner', async function () {
      await expect(devcon.withdrawUnclaimedFunds())
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts if claiming has not been closed yet', async function () {
      await bidAndSettleRaffle(2)

      await expect(devconAsOwner.withdrawUnclaimedFunds())
        .to.be.revertedWith('Devcon6: is in invalid state')
    })

    it('transfers unclaimed funds', async function () {
      await bidAndSettleRaffle(10)
      await devconAsOwner.claimProceeds()

      await endClaiming(devconAsOwner)

      const unclaimedFunds = reservePrice.mul(2)
      expect(await withdrawUnclaimedFunds()).to.be.equal(unclaimedFunds)
    })

    it('transfers remaining unclaimed funds', async function () {
      await bidAndSettleRaffle(10)
      await devconAsOwner.claimProceeds()

      const goldenBid = await getBidByWinType(10, WinType.goldenTicket)
      await devconAsOwner.claim(goldenBid.bidderID)

      await endClaiming(devconAsOwner)

      expect(await withdrawUnclaimedFunds()).to.be.equal(reservePrice)
    })

    async function endClaiming(devcon: Devcon6) {
      const endTime = await devcon.claimingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
    }

    // Returns amount transferred to owner by withdrawUnclaimedFunds method
    async function withdrawUnclaimedFunds(): Promise<BigNumber> {
      return calculateTransferredAmount(devconAsOwner.withdrawUnclaimedFunds)
    }
  })

  describe('rescueTokens', function () {
    let exampleToken: ExampleToken

    beforeEach(async function () {
      ({ exampleToken, devcon, provider } = await loadFixture(devcon6FixtureWithToken))
      devconAsOwner = devcon.connect(owner())
    })

    describe('when called not by owner', function () {
      it('reverts', async function () {
        await expect(devcon.rescueTokens(exampleToken.address))
          .to.be.revertedWith('Ownable: caller is not the owner')
      })
    })

    describe('when balance for given token equals zero', function () {
      it('reverts', async function () {
        await expect(devconAsOwner.rescueTokens(exampleToken.address))
          .to.be.revertedWith('Devcon6: no tokens for given address')
      })
    })

    it('transfers tokens', async function () {
      await exampleToken.transfer(devcon.address, 100)
      const balanceBeforeRescue = await exampleToken.balanceOf(owner().address)

      await devconAsOwner.rescueTokens(exampleToken.address)
      expect(await exampleToken.balanceOf(owner().address)).to.be.equal(balanceBeforeRescue.add(100))
    })
  })

  describe('fallback', function () {
    describe('when transfers ether without calldata', function () {
      it('reverts', async function () {
        await expect(owner().sendTransaction({ to: devcon.address, value: parseEther('1') }))
          .to.be.revertedWith('Devcon6: contract accepts ether transfers only by bid method')
      })
    })

    describe('when transfers ether with calldata', function () {
      it('reverts', async function () {
        const params = {
          to: devcon.address,
          value: parseEther('1'),
          data: '0x7D86687F980A56b832e9378952B738b614A99dc6',
        }
        await expect(owner().sendTransaction(params))
          .to.be.revertedWith('Devcon6: contract accepts ether transfers only by bid method')
      })
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

    it('claiming closed', async function () {
      const endTime = await devcon.claimingEndTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
      await network.provider.send('evm_mine')

      expect(await devcon.getState()).to.be.equal(State.claimingClosed)
    })
  })

  describe('getBid', function () {
    it('reverts for unknown bidder address', async function () {
      await expect(devcon.getBid(randomAddress()))
        .to.be.revertedWith('Devcon6: no bid by given address')
    })

    it('returns bid details', async function () {
      await bid(1)
      const { bidderID, amount, winType } = await devcon.getBid(wallets[0].address)
      expect(bidderID).to.eq(1)
      expect(amount).to.eq(reservePrice)
      expect(winType).to.eq(0)
    })
  })

  describe('getBidderAddress', function () {
    it('reverts for zero bidder ID', async function () {
      await expect(devcon.getBidderAddress(0))
        .to.be.revertedWith('Devcon6: bidder with given ID does not exist')
    })

    it('reverts for invalid bidder ID', async function () {
      await bid(1)
      await expect(devcon.getBidderAddress(2))
        .to.be.revertedWith('Devcon6: bidder with given ID does not exist')
    })

    it('returns bidder address', async function () {
      await bid(1)
      expect(await devcon.getBidderAddress(1)).to.eq(wallets[0].address)
    })
  })

  function owner() {
    return wallets[1]
  }

  async function bidAndSettleRaffle(bidCount: number): Promise<ContractTransaction> {
    await bid(bidCount)
    await endBidding(devconAsOwner)
    await settleAuction()
    return devconAsOwner.settleRaffle(randomBigNumbers(1))
  }

  async function endBidding(devcon: Devcon6) {
    const endTime = await devcon.biddingEndTime()
    await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
    await network.provider.send('evm_mine')
  }

  async function settleAuction(): Promise<ContractTransaction> {
    return devconAsOwner.settleAuction({ gasLimit: 4_000_000 })
  }

  async function bid(walletCount: number) {
    for (let i = 0; i < walletCount; i++) {
      await bidAsWallet(wallets[i], reservePrice)
    }
  }

  async function bidAsWallet(wallet: Wallet, value: BigNumberish) {
    await devcon.connect(wallet).bid({ value })
  }

  async function getBidByID(bidID: number): Promise<Bid> {
    const bidderAddress = await devconAsOwner.getBidderAddress(bidID)
    return devconAsOwner.getBid(bidderAddress)
  }

  async function getBidByWinType(bidCount: number, winType: WinType): Promise<Bid> {
    for (let i = 1; i <= bidCount; i++) {
      const bid = await getBidByID(i)
      if (bid.winType === winType) {
        return bid
      }
    }
  }

  async function getAllBidsByWinType(bidCount: number, winType: WinType): Promise<Bid[]> {
    const bids = []
    for (let i = 1; i <= bidCount; i++) {
      const bid = await getBidByID(i)
      if (bid.winType === winType) {
        bids.push(bid)
      }
    }
    return bids
  }

  async function calculateTransferredAmount(transaction: () => Promise<ContractTransaction>): Promise<BigNumber> {
    const balanceBeforeClaim = await owner().getBalance()
    const tx = await transaction()
    const txCost = await calculateTxCost(tx)
    const balanceAfterClaim = await owner().getBalance()
    return balanceAfterClaim.add(txCost).sub(balanceBeforeClaim)
  }

  async function calculateTxCost(tx: ContractTransaction): Promise<BigNumber> {
    const txReceipt = await tx.wait()
    return txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)
  }

  async function emitsEvents(tx: ContractTransaction, eventName: string, ...args: any[][]) {
    const txReceipt = await tx.wait()
    const filteredEvents = txReceipt.events.filter((event) => event.event === eventName)
    expect(filteredEvents.length).to.be.equal(args.length)

    filteredEvents.forEach((event, index) => {
      expect(event.event).to.be.equal(eventName)

      expect(event.args.length).to.be.equal(args[index].length)
      event.args.forEach((value, j) => {
        expect(value).to.be.equal(args[index][j])
      })
    })
  }
})
