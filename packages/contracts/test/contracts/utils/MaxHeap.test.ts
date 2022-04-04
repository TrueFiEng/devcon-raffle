import { setupFixtureLoader } from '../../setup'
import { maxHeapMockFixture } from 'fixtures/maxHeapMockFixture'
import { MaxHeapMock } from 'contracts'
import { expect } from 'chai'
import { biggerFirst, bigNumberArrayFrom, randomBigNumbers } from 'utils/bigNumber'
import { BigNumber, BigNumberish } from 'ethers'

describe('MaxHeap', function () {
  const loadFixture = setupFixtureLoader()

  let heap: MaxHeapMock

  beforeEach(async function () {
    ({ heap } = await loadFixture(maxHeapMockFixture))
  })

  async function insert(keys: BigNumberish[]) {
    for (const key of keys) {
      await heap.insert(key)
    }
  }

  describe('insert', function () {
    it('adds the first element properly', async function () {
      await heap.insert(1)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([1]))
    })

    it('can swap left child with parent', async function () {
      await insert([1, 2])
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([2, 1]))
    })

    it('can swap right child with parent', async function () {
      await insert([2, 1, 3])
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([3, 1, 2]))
    })

    it('can bubble more then one level up', async function () {
      await insert([2, 1, 3, 4])
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([4, 3, 2, 1]))
    })

    it('knows when to stop bubbling up', async function () {
      await insert([2, 4, 1, 3])
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([4, 3, 1, 2]))
    })
  })

  describe('removeMax', function () {
    async function removeMax() {
      const tx = await heap.removeMax()
      const receipt = await tx.wait()
      expect(receipt.logs).to.have.lengthOf(1)
      const returnValueLog = receipt.logs[0]
      return BigNumber.from(returnValueLog.data)
    }

    it('reverts when heap is empty', async function () {
      await expect(heap.removeMax())
        .to.be.revertedWith('MaxHeap: cannot remove max element from empty heap')
    })

    it('removes key from single-key heap', async function () {
      await insert([1234])
      expect(await removeMax()).to.eq(1234)
      expect(await heap.getArray()).to.be.empty
    })

    it('removes key from two-key heap', async function () {
      await insert([1, 2])
      expect(await removeMax()).to.eq(2)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([1]))
    })

    it('can swap left child with parent', async function () {
      await insert([2, 3, 1])
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([3, 2, 1]))

      expect(await removeMax()).to.eq(3)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([2, 1]))
    })

    it('can swap right child with parent', async function () {
      await insert([1, 4, 5, 3, 2])
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([5, 3, 4, 1, 2]))

      expect(await removeMax()).to.eq(5)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([4, 3, 2, 1]))
    })

    it('can bubble more than one level down', async function () {
      await insert([2, 3, 5, 4, 1])
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([5, 4, 3, 2, 1]))

      expect(await removeMax()).to.eq(5)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([4, 2, 3, 1]))
    })

    it('removes max element every time', async function () {
      const keys = randomBigNumbers(20)
      await insert(keys)

      keys.sort(biggerFirst)
      for (const key of keys) {
        expect(await removeMax()).to.eq(key)
      }
      expect(await heap.getArray()).to.be.empty
    })
  })
})
