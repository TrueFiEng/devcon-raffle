import { addressEqual, useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'

import { useDevconContract } from './contract'
import { useBids } from './useBids'

export function useSettledBid() {
  const devconContract = useDevconContract()
  const { account } = useEthers()
  const { bids } = useBids()

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
  const bidWithPlace = useMemo(() => bids.find((bid) => account && addressEqual(bid.bidderAddress, account)), [account, bids])

  return settledBid && bidWithPlace && account
    ? {
        bidderID: settledBid.bidderID,
        bidderAddress: account,
        amount: settledBid.amount,
        place: bidWithPlace.place,
        winType: settledBid.winType,
        claimed: settledBid.claimed,
      }
    : undefined
}
