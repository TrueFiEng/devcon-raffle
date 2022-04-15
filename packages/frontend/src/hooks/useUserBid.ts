import { addressEqual, useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'

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
    () => bids.find((bid) => account && addressEqual(bid.bidderAddress, account)),
    [account, bids]
  )

  return bid && bidWithPlace && account
    ? {
        bidderID: bid.bidderID,
        bidderAddress: account,
        amount: bid.amount,
        place: bidWithPlace.place,
        winType: bid.winType,
        claimed: bid.claimed,
      }
    : undefined
}
