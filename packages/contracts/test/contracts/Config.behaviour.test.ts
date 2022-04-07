import { setupFixtureLoader } from '../setup'
import { configuredDevcon6Fixture } from 'fixtures/devcon6Fixture'
import { expect } from 'chai'

describe('Config', function () {
  const loadFixture = setupFixtureLoader()

  describe('constructor', function () {
    it('reverts for zero auction winners count', async function () {
      await expect(loadFixture(configuredDevcon6Fixture({ auctionWinnersCount: 0 })))
        .to.be.revertedWith('Config: auction winners count must be greater than 0')
    })

    it('reverts for zero raffle winners count', async function () {
      await expect(loadFixture(configuredDevcon6Fixture({ raffleWinnersCount: 0 })))
        .to.be.revertedWith('Config: raffle winners count must be greater than 0')
    })

    it('reverts for raffle winners count non-divisible by 8', async function () {
      await expect(loadFixture(configuredDevcon6Fixture({ raffleWinnersCount: 7 })))
        .to.be.revertedWith('Config: raffle winners count must be divisible by 8')
    })

    it('reverts for bidding start time after bidding end time', async function () {
      await expect(loadFixture(
        configuredDevcon6Fixture({
          biddingStartTime: 200,
          biddingEndTime: 100,
          claimingEndTime: 300,
        }),
      )).to.be.revertedWith('Config: bidding start time must be before bidding end time')
    })

    it('reverts for bidding start time after bidding end time', async function () {
      await expect(loadFixture(
        configuredDevcon6Fixture({
          biddingStartTime: 100,
          biddingEndTime: 300,
          claimingEndTime: 200,
        }),
      )).to.be.revertedWith('Config: bidding end time must be before claiming end time')
    })

    it('reverts for zero reserve price', async function () {
      await expect(loadFixture(configuredDevcon6Fixture({ reservePrice: 0 })))
        .to.be.revertedWith('Config: reserve price must be greater than 0')
    })

    it('reverts for zero min bid increment', async function () {
      await expect(loadFixture(configuredDevcon6Fixture({ minBidIncrement: 0 })))
        .to.be.revertedWith('Config: min bid increment must be greater than 0')
    })
  })
})
