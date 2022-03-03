import { setupFixtureLoader } from '../setup'
import { expect } from 'chai'
import { quickSortFixture } from './fixtures/fixture'
import { QuickSort } from 'contracts'
import { quickSortBigNumbers } from 'utils/quickSort'
import { BigNumber } from 'ethers'
import { getRandomInt } from 'utils/random'

describe('QuickSort', function() {
  this.timeout(60000)

  const loadFixture = setupFixtureLoader()
  let quickSort: QuickSort

  beforeEach(async() => {
    ({ quickSort } = await loadFixture(quickSortFixture))
  })

  it('sorts 1000 elements', async() => {
    await testQuickSort()
  })

  it('sorts 3000 elements', async() => {
    const newElements: BigNumber[] = []

    for (let i = 0; i < 2000; i++) {
      newElements.push(BigNumber.from(getRandomInt(10_000_000)))
    }

    await quickSort.add(newElements)

    expect(await quickSort.getArrayLength()).to.eq(3000)

    await testQuickSort()
  })

  async function testQuickSort() {
    const arrBeforeSorting = await quickSort.getArray()

    const tx = await quickSort.sort({
      gasLimit: 150_000_000, // Block gas limit set in hardhat config file
    })
    console.log(`Gas used: ${(await tx.wait()).gasUsed}`)

    const arrAfterSorting = await quickSort.getArray()

    expect(arrAfterSorting).to.not.deep.eq(arrBeforeSorting)

    const correctlySortedArr = quickSortBigNumbers(arrBeforeSorting)

    expect(arrAfterSorting).to.deep.eq(correctlySortedArr)
  }
})
