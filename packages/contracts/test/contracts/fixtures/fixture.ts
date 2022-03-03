import { Example__factory, QuickSort__factory } from 'contracts'
import { BigNumber, Wallet } from 'ethers'
import { getRandomInt } from 'utils/random'

export async function exampleFixture([owner]: Wallet[]) {
  const example = await new Example__factory(owner).deploy()

  return { example }
}

export async function quickSortFixture([owner]: Wallet[]) {
  const array: BigNumber[] = []
  for (let i = 0; i < 1_000; i++) {
    array.push(BigNumber.from(getRandomInt(10_000_000)))
  }

  const quickSort = await new QuickSort__factory(owner).deploy(array, {
    gasLimit: 150_000_000,
  })

  return { quickSort }
}
