import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { devcon6Fixture, devcon6FixtureWithStartTime, minBidIncrement, reservePrice } from 'fixtures/devcon6Fixture'
import { Devcon6 } from 'contracts'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { Provider } from '@ethersproject/providers'
import { HOUR, MINUTE } from 'utils/consts'
import { network } from 'hardhat'

describe('Devcon6', function () {
  const loadFixture = setupFixtureLoader()

  let provider: Provider
  let devcon: Devcon6

  beforeEach(async function () {
    ({ provider, devcon } = await loadFixture(devcon6Fixture))
  })

  describe('bid', function () {
    it('reverts if bidding is not opened yet', async function () {
      const currentTime = await getLatestBlockTimestamp(provider);
      ({ devcon } = await loadFixture(devcon6FixtureWithStartTime(currentTime + MINUTE)))

      await expect(devcon.bid()).to.be.revertedWith('Devcon6: bidding is not open yet')
    })

    it('reverts if bidding has already finished', async function () {
      const endTime = await devcon.endTime()
      await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])

      await expect(devcon.bid()).to.be.revertedWith('Devcon6: bidding is already closed')
    })

    it('reverts if bidding amount is below reserve price', async function () {
      await expect(devcon.bid({ value: reservePrice.sub(100) })).to.be.revertedWith('Devcon6: bidding amount is below reserve price')
    })

    it('saves bid', async function () {
      await expect(devcon.bid({ value: reservePrice })).to.be.not.reverted

      const bidder = await devcon.signer.getAddress()
      const bid = await devcon.getBid(bidder)

      expect(bid.amount).to.be.equal(reservePrice)
      expect(bid.bidderID).to.be.equal(0)
    })

    it('saves bidder', async function () {
      await devcon.bid({ value: reservePrice })
      const bidder = await devcon.getBidderAddress(0)

      expect(bidder).to.be.equal(await devcon.signer.getAddress())
    })

    it('increases bidder id', async function () {
      await devcon.bid({ value: reservePrice })

      expect(await devcon.bidderID()).to.be.equal(1)
    })

    it('reverts if bid increase is too low', async function () {
      await devcon.bid({ value: reservePrice })
      await expect(devcon.bid({ value: minBidIncrement.sub(100) })).to.be.revertedWith('Devcon6: bid increment too low')
    })

    it('increases bid amount', async function () {
      await devcon.bid({ value: reservePrice })
      await expect(devcon.bid({ value: minBidIncrement })).to.be.not.reverted

      const bidder = await devcon.signer.getAddress()
      const bid = await devcon.getBid(bidder)

      expect(bid.amount).to.be.equal(reservePrice.add(minBidIncrement))
    })
  })
})
