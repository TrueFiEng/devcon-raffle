import { addressEqual, useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'

import { useDevconContract } from './contract'
import { useBids } from './useBids'

export function useUserBid() {
  const { devcon, chainId } = useDevconContract()
  const { account } = useEthers()
  const { bids } = useBids()

  const { value } =
    useCall(
      account && {
        contract: devcon,
        method: 'getBid',
        args: [account],
      },
      { chainId }
    ) ?? {}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bid = useMemo(() => value && value[0], [JSON.stringify(value)])
  const bidWithPlace = useMemo(
    () => bids.find((bid) => !!account && addressEqual(bid.get('bidderAddress'), account)),
    [account, bids]
  )

  return bidWithPlace && account
    ? {
        bidderID: bidWithPlace.get('bidderID'),
        bidderAddress: account,
        amount: bid?.amount || bidWithPlace.get('amount'),
        place: bidWithPlace.get('place'),
        winType: bid?.winType || WinType.Loss,
        claimed: bid?.claimed || false,
      }
    : undefined
}
