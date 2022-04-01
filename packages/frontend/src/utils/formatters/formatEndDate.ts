import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

export function formatEndDate(timestamp: BigNumber) {
  const date = new Date(timestamp.toNumber()).toISOString()
  return moment(date).format('DD.MM')
}
