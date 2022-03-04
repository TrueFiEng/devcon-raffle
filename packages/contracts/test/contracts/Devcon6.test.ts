import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { devcon6Fixture } from 'fixtures/devcon6Fixture'
import { Devcon6 } from 'contracts'

describe('Devcon6', function () {
  const loadFixture = setupFixtureLoader()

  let devcon: Devcon6

  beforeEach(async function () {
    ({ devcon } = await loadFixture(devcon6Fixture))
  })

  describe('bid', function () {
    it('works', async function () {
      await expect(devcon.bid()).to.not.be.reverted
    })
  })
})
