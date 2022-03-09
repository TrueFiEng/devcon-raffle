import { BigNumber } from 'ethers'

export function bigNumberArrayFrom(arr: number[]): BigNumber[] {
  return arr.map((element) => BigNumber.from(element))
}
