import { BigNumber } from '@ethersproject/bignumber'

export function padZeroes(number: BigNumber | number, length = 2) {
  const numberString = number.toString()
  const missingLength = length - numberString.length
  return missingLength > 0 ? '0'.repeat(missingLength) + numberString : numberString
}
