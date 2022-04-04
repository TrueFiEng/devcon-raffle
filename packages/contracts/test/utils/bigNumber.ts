import { BigNumber, utils } from 'ethers'

export function bigNumberArrayFrom(arr: number[]): BigNumber[] {
  return arr.map((element) => BigNumber.from(element))
}

export function randomBigNumbers(amount: number): BigNumber[] {
  const randomNumbers: BigNumber[] = []
  for (let i = 0; i < amount; i++) {
    randomNumbers.push(randomBN())
  }
  return randomNumbers
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

function randomBN(): BigNumber {
  return BigNumber.from(utils.randomBytes(32))
}
