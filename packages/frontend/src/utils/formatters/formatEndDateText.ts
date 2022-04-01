import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

export function formatEndDateText(timestamp: BigNumber) {
  const date = new Date(timestamp.mul(1000).toNumber()).toISOString()
  const dateText = moment(date).format('MMMM Do')
  const timeText = moment(date).format('hh A')
  return { dateText, timeText }
}