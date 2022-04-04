import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

import { padZeroes } from './padZeroes'

export function formatTimeLeft(timestamp: BigNumber, now = Date.now()) {
  const date = moment(new Date(timestamp.mul(1000).toNumber()).toISOString())
  const difference = date.diff(now) > 0 ? date.diff(now) : 0
  const duration = moment.duration(difference)

  const days = padZeroes(duration.days())
  const hours = padZeroes(duration.hours())
  const minutes = padZeroes(duration.minutes())

  return `${days}d ${hours}h ${minutes}m`
}
