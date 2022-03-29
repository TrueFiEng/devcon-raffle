import { BigNumber } from '@ethersproject/bignumber'

export function formatEndDateText(timestamp: BigNumber) {
  const date = new Date(timestamp.mul(1000).toNumber())
  const dateText = date.toLocaleString('en-UK', { day: 'numeric', month: 'long' })
  const timeText = date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true })
  return { dateText, timeText }
}
