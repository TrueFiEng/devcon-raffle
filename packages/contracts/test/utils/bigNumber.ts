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

function randomBN(): BigNumber {
  return BigNumber.from(utils.randomBytes(32))
}
