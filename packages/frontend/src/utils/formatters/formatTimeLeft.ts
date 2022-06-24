import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

import { padZeroes } from './padZeroes'

export function formatTimeLeft(timestamp?: BigNumber, now = Date.now()) {
  if (!timestamp) {
    return '-'
  }

  const date = moment.unix(timestamp.toNumber())
  const difference = date.diff(now) > 0 ? date.diff(now) : 0
  const duration = moment.duration(difference)

  const days = padZeroes(duration.asDays().toFixed(0))
  const hours = padZeroes(duration.hours())
  const minutes = padZeroes(duration.minutes())

  return `${days}d ${hours}h ${minutes}m`
}
