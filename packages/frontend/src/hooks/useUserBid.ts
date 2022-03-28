import { addressEqual, useEthers } from '@usedapp/core'
import { useMemo } from 'react'

import { useBids } from './useBids'

export function useUserBid() {
  const { account } = useEthers()
  const { bids } = useBids()

  return useMemo(() => bids.find((bid) => account && addressEqual(bid.bidderAddress, account)), [account, bids])
}
