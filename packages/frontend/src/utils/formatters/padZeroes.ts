import { BigNumber } from '@ethersproject/bignumber'

export function padZeroes(number: BigNumber | number | string, length = 2) {
  return number.toString().padStart(length, '0')
}
