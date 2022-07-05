import moment from 'moment-timezone'
import { useMemo } from 'react'
import { CONFIG } from 'src/config/config'

import { useDevconParam } from './useDevconParam'

const REDEEM_PERIOD = moment.unix(0).add(48, 'h').unix()

export function useVoucherRedeemDeadline() {
  const { devconValue } = useDevconParam('biddingEndTime')
  const { voucherRedeemDeadline } = CONFIG
  return useMemo(() => voucherRedeemDeadline ?? devconValue?.add(REDEEM_PERIOD), [voucherRedeemDeadline, devconValue])
}
