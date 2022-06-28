import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment-timezone'

export function formatEndDate(timestamp?: BigNumber, timeZone: string = moment.tz.guess()) {
  if (!timestamp) {
    return '-'
  }

  return moment.unix(timestamp.toNumber()).tz(timeZone).format('DD.MM, HH:mm zz')
}
