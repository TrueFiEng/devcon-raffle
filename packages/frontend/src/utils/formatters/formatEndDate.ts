import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

export function formatEndDate(timestamp: BigNumber) {
  return moment.unix(timestamp.toNumber()).format('DD.MM')
}
