import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

export function formatEndDateText(timestamp: BigNumber) {
  const date = moment.unix(timestamp.toNumber())
  const dateText = date.format('MMMM Do')
  const timeText = date.format('hh A')
  return { dateText, timeText }
}
