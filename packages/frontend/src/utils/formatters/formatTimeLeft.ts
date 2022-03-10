import { BigNumber } from '@ethersproject/bignumber'

import { padZeroes } from './padZeroes'

const MillisInMinute = 1000 * 60
const SecondsInMinute = 60
const MinutesInHour = 60
const MinutesInDay = 24 * 60

export function formatTimeLeft(dateSeconds: BigNumber, now = Date.now()) {
  const dateMinutes = dateSeconds.div(SecondsInMinute)
  const nowMinutes = Math.floor(now / MillisInMinute)

  const difference = dateMinutes.gt(nowMinutes) ? dateMinutes.sub(nowMinutes) : BigNumber.from(0)

  const days = padZeroes(difference.div(MinutesInDay))
  const hours = padZeroes(difference.mod(MinutesInDay).div(MinutesInHour))
  const minutes = padZeroes(difference.mod(MinutesInHour))

  return `${days}d ${hours}h ${minutes}m`
}
