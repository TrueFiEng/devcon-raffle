import { BigNumber } from 'ethers'

export function bigNumberArrayFrom(arr: number[]): BigNumber[] {
  return arr.map((element) => BigNumber.from(element))
}

export function biggerFirst(a: BigNumber, b: BigNumber) {
  if (a.eq(b)) {
    return 0
  }
  if (a.gt(b)) {
    return -1
  }
  return 1
}
