import { useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { SettledBid } from 'src/models/Bid'

import { useDevconContract } from './contract'

export function useSettledBid(): SettledBid | undefined {
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
  const bidSettled = useMemo(() => value && value[0], [JSON.stringify(value)])
  return bidSettled && account
    ? {
        bidderAddress: account,
        amount: bidSettled.amount,
        winType: bidSettled.winType,
        claimed: bidSettled.claimed,
      }
    : undefined
}
