import { BigNumber } from 'ethers'

function swap(items, leftIndex, rightIndex) {
  const temp = items[leftIndex]
  items[leftIndex] = items[rightIndex]
  items[rightIndex] = temp
}

function partition(items, left, right) {
  const pivot = items[Math.floor((right + left) / 2)] // middle element
  let i = left // left pointer
  let j = right // right pointer
  while (i <= j) {
    while (items[i] < pivot) {
      i++
    }
    while (items[j] > pivot) {
      j--
    }
    if (i <= j) {
      swap(items, i, j) // swapping two elements
      i++
      j--
    }
  }
  return i
}

function quickSort(items, left, right) {
  let index
  if (items.length > 1) {
    index = partition(items, left, right) // index returned from partition
    if (left < index - 1) { // more elements on the left side of the pivot
      quickSort(items, left, index - 1)
    }
    if (index < right) { // more elements on the right side of the pivot
      quickSort(items, index, right)
    }
  }
  return items
}

export function quickSortBigNumbers(items: BigNumber[]) {
  const results = quickSort(items.map((item) => item.toNumber()), 0, items.length - 1)
  return results.map((item) => BigNumber.from(item))
}
