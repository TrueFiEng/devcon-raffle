import { setupFixtureLoader } from '../../setup'
import { Hashing } from 'contracts'
import { hashingFixture } from 'fixtures/hashingFixture'
import { utils } from 'ethers'
import { expect } from 'chai'
import { hashTwo } from 'scripts/utils/hashTwo'

describe('hashTwo', function () {
  const loadFixture = setupFixtureLoader()

  let hashing: Hashing

  it('concatenates and hashes properly', async function () {
    hashing = await loadFixture(hashingFixture)

    const first = utils.id('first')
    const second = utils.id('second')
    const contractHash = await hashing.hashTwo(first, second)

    expect(hashTwo(first, second)).to.eq(contractHash)
  })
})
