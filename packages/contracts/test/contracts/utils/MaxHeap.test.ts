import { setupFixtureLoader } from '../../setup'
import { maxHeapMockFixture } from 'fixtures/maxHeapMockFixture'
import { MaxHeapMock } from 'contracts'
import { expect } from 'chai'
import { bigNumberArrayFrom } from 'utils/bigNumber'

describe('MaxHeap', function() {
  const loadFixture = setupFixtureLoader()

  let heap: MaxHeapMock

  beforeEach(async function() {
    ({ heap } = await loadFixture(maxHeapMockFixture))
  })

  describe('insert', function() {
    it('adds the first element properly', async function() {
      await heap.insert(1)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([1]))
    })

    it('can swap left child with parent', async function() {
      await heap.insert(1)
      await heap.insert(2)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([2, 1]))
    })

    it('can swap right child with parent', async function() {
      await heap.insert(2)
      await heap.insert(1)
      await heap.insert(3)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([3, 1, 2]))
    })

    it('can bubble more then one level up', async function() {
      await heap.insert(2)
      await heap.insert(1)
      await heap.insert(3)
      await heap.insert(4)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([4, 3, 2, 1]))
    })

    it('knows when to stop bubbling up', async function() {
      await heap.insert(2)
      await heap.insert(4)
      await heap.insert(1)
      await heap.insert(3)
      expect(await heap.getArray()).to.deep.eq(bigNumberArrayFrom([4, 3, 1, 2]))
    })
  })
})
