import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { devcon6Fixture, devcon6FixtureWithStartTime, reservePrice } from 'fixtures/devcon6Fixture'
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
    it('reverts if bidding is not open yet', async function () {
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

    it('saves bid amount', async function () {
      await expect(devcon.bid({ value: reservePrice })).to.be.not.reverted

      const bidder = await devcon.signer.getAddress()
      const { amount } = await devcon.getBid(bidder)

      expect(amount).to.be.equal(reservePrice)
    })

  })
})
