import { setupFixtureLoader } from '../../setup'
import { maxHeapMockFixture } from 'fixtures/maxHeapMockFixture'
import { MaxHeapMock } from 'contracts'
import { BigNumberish, ContractTransaction } from 'ethers'
import { randomBigNumbers } from 'scripts/utils/random'

const RUNS = 20

describe('MaxHeap - Gas Usage', function () {
  const loadFixture = setupFixtureLoader()

  describe('insert', function () {
    it('adding 20th key', async function () {
      await measure('insert()', async () => {
        const { heap } = await loadFixture(maxHeapMockFixture)
        const [last, ...keys] = randomBigNumbers(20)
        await insert(heap, keys)
        return getGasUsed(heap.insert(last))
      })
    })
  })

  describe('increaseKey', function () {
    it('increasing key in heap of size 20', async function () {
      await measure('increaseKey()', async () => {
        const { heap } = await loadFixture(maxHeapMockFixture)
        const keys = randomBigNumbers(20)
        await insert(heap, keys)

        const randomKey = randomElement(keys)
        return getGasUsed(heap.increaseKey(randomKey, randomKey.add(1)))
      })
    })
  })

  describe('removeAll', function () {
    it('removing all keys in descending order from heap of size 20', async function () {
      await measure('removeAll()', async () => {
        const { heap } = await loadFixture(maxHeapMockFixture)
        const keys = randomBigNumbers(20)
        await insert(heap, keys)

        return getGasUsed(heap.removeAll())
      })
    })
  })

  async function measure(name: string, experiment: () => Promise<number>) {
    const results = []
    for (let i = 0; i < RUNS; i++) {
      process.stdout.write('.')
      results.push(await experiment())
    }

    const max = Math.max(...results)
    const min = Math.min(...results)
    const avg = average(results)
    console.log(`\n${name} | min: ${min}, max: ${max}, avg: ${avg}`)
  }

  async function insert(heap: MaxHeapMock, keys: BigNumberish[]) {
    for (const key of keys) {
      await heap.insert(key)
    }
  }

  async function getGasUsed(txPromise: Promise<ContractTransaction>) {
    const tx = await txPromise
    const receipt = await tx.wait()
    return receipt.gasUsed.toNumber()
  }

  function average(nums: number[]) {
    return nums.reduce((a, b) => a + b, 0) / nums.length
  }

  function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }
})
