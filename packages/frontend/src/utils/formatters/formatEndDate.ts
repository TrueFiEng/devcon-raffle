import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

export function formatEndDate(timestamp?: BigNumber) {
  if (!timestamp) {
    return '-'
  }

  return moment.unix(timestamp.toNumber()).format('DD.MM')
}
