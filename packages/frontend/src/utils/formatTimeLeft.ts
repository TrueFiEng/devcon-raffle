import { BigNumber } from '@ethersproject/bignumber'

const MillisInMinute = 1000 * 60
const SecondsInMinute = 60
const MinutesInHour = 60
const MinutesInDay = 24 * 60

export function formatTimeLeft(dateSeconds: BigNumber, now = Date.now()) {
  const dateMinutes = dateSeconds.div(SecondsInMinute)
  const nowMinutes = Math.floor(now / MillisInMinute)

  const difference = dateMinutes.gt(nowMinutes) ? dateMinutes.sub(nowMinutes) : BigNumber.from(0)

  const days = padZero(difference.div(MinutesInDay))
  const hours = padZero(difference.mod(MinutesInDay).div(MinutesInHour))
  const minutes = padZero(difference.mod(MinutesInHour))

  return `${days}d ${hours}h ${minutes}m`
}

function padZero(number: BigNumber) {
  const numberString = number.toString()
  return numberString.length === 1 ? '0' + numberString : numberString
}
