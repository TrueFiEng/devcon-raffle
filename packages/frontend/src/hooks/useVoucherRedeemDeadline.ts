import { useMemo } from 'react'
import { CONFIG } from 'src/config/config'

import { useDevconParam } from './useDevconParam'

export function useVoucherRedeemDeadline() {
  const { devconValue } = useDevconParam('biddingEndTime')
  const { voucherRedeemDeadline } = CONFIG
  return useMemo(() => voucherRedeemDeadline ?? devconValue?.add(48 * 60 * 60), [voucherRedeemDeadline, devconValue])
}
