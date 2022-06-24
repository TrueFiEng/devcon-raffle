import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment-timezone'

export function formatEndDate(timestamp?: BigNumber) {
  if (!timestamp) {
    return '-'
  }

  const timeZone = moment.tz.guess()
  return moment.unix(timestamp.toNumber()).tz(timeZone).format('DD.MM, HH:mm zz')
}
