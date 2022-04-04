import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

export function formatTimeLeft(timestamp: BigNumber, now = Date.now()) {
  const date = moment(new Date(timestamp.mul(1000).toNumber()).toISOString())
  const difference = date.diff(now)
  const duration = moment.duration(difference)

  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()

  return `${days}d ${hours}h ${minutes}m`
}
