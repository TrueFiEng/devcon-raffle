import { setupFixtureLoader } from '../setup'
import { configuredAuctionRaffleFixture } from 'fixtures/auctionRaffleFixture'
import { expect } from 'chai'
import { HOUR } from 'scripts/utils/consts'

describe('Config', function () {
  const loadFixture = setupFixtureLoader()

  describe('constructor', function () {
    it('reverts for zero auction winners count', async function () {
      await expect(loadFixture(configuredAuctionRaffleFixture({ auctionWinnersCount: 0 })))
        .to.be.revertedWith('Config: auction winners count must be greater than 0')
    })

    it('reverts for zero raffle winners count', async function () {
      await expect(loadFixture(configuredAuctionRaffleFixture({ raffleWinnersCount: 0 })))
        .to.be.revertedWith('Config: raffle winners count must be greater than 0')
    })

    it('reverts for raffle winners count non-divisible by 8', async function () {
      await expect(loadFixture(configuredAuctionRaffleFixture({ raffleWinnersCount: 7 })))
        .to.be.revertedWith('Config: invalid raffle winners count')
    })

    it('reverts for bidding start time after bidding end time', async function () {
      await expect(loadFixture(
        configuredAuctionRaffleFixture({
          biddingStartTime: 200,
          biddingEndTime: 100,
          claimingEndTime: 300,
        }),
      )).to.be.revertedWith('Config: bidding start time must be before bidding end time')
    })

    it('reverts for bidding end time after claiming end time', async function () {
      await expect(loadFixture(
        configuredAuctionRaffleFixture({
          biddingStartTime: 100,
          biddingEndTime: 300,
          claimingEndTime: 200,
        }),
      )).to.be.revertedWith('Config: bidding end time must be before claiming end time')
    })

    it('reverts for zero reserve price', async function () {
      await expect(loadFixture(configuredAuctionRaffleFixture({ reservePrice: 0 })))
        .to.be.revertedWith('Config: reserve price must be greater than 0')
    })

    it('reverts for zero min bid increment', async function () {
      await expect(loadFixture(configuredAuctionRaffleFixture({ minBidIncrement: 0 })))
        .to.be.revertedWith('Config: min bid increment must be greater than 0')
    })

    it('reverts for bidding start time close to bidding end time', async function () {
      await expect(loadFixture(
        configuredAuctionRaffleFixture({
          biddingStartTime: 0,
          biddingEndTime: 6 * HOUR - 1,
          claimingEndTime: 24 * HOUR,
        }),
      )).to.be.revertedWith('Config: bidding start time and bidding end time must be at least 6h apart')
    })

    it('reverts for bidding end time close to bidding end time', async function () {
      await expect(loadFixture(
        configuredAuctionRaffleFixture({
          biddingStartTime: 0,
          biddingEndTime: 6 * HOUR,
          claimingEndTime: 12 * HOUR - 1,
        }),
      )).to.be.revertedWith('Config: bidding end time and claiming end time must be at least 6h apart')
    })
  })
})
