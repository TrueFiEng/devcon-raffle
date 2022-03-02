import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { exampleFixture } from './fixture'
import { BigNumber } from 'ethers'

describe('Example', () => {
  const loadFixture = setupFixtureLoader()

  it('add', async () => {
    const { example } = await loadFixture(exampleFixture)

    await example.add(BigNumber.from(5))

    expect(await example.a()).to.eq(BigNumber.from(10))
  })
})
