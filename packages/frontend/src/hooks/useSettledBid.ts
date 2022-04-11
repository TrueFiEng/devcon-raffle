import { useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'

import { useDevconContract } from './contract'

export function useSettledBid() {
  const devconContract = useDevconContract()
  const { account } = useEthers()

  const { value } =
    useCall(
      devconContract &&
        account && {
          contract: devconContract,
          method: 'getBid',
          args: [account],
        }
    ) ?? {}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const settledBid = useMemo(() => value && value[0], [JSON.stringify(value)])
  return settledBid && account
    ? {
        bidderID: settledBid.bidderID,
        bidderAddress: account,
        amount: settledBid.amount,
        winType: settledBid.winType,
        claimed: settledBid.claimed,
      }
    : undefined
}
