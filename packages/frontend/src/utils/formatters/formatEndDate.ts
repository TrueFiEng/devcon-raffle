import { BigNumber } from '@ethersproject/bignumber'

import { padZeroes } from './padZeroes'

export function formatEndDate(timestamp: BigNumber) {
  const date = new Date(timestamp.mul(1000).toNumber())
  return padZeroes(date.getDate()) + '.' + padZeroes(date.getMonth() + 1)
}
