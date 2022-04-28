import { useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'

import { useDevconContract } from './contract'
import { useBids } from './useBids'

export function useUserBid() {
  const { devcon, chainId } = useDevconContract()
  const { account } = useEthers()
  const { bids, bidders } = useBids()

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

  return useMemo(() => {
    if (!account) {
      return undefined
    }

    const bidderIndex = bidders.get(account)
    if (bidderIndex === undefined) {
      return undefined
    }
    const bidWithPlace = bids.get(bidderIndex)!.toObject()

    if (bid === undefined) {
      return {
        bidderID: bidWithPlace.bidderID,
        bidderAddress: account,
        amount: bidWithPlace.amount,
        place: bidWithPlace.place,
        winType: WinType.Loss,
        claimed: false,
      }
    }

    return {
      bidderID: bid.bidderID,
      bidderAddress: account,
      amount: bid.amount,
      place: bidWithPlace.place,
      winType: bid.winType,
      claimed: bid.claimed
    }
  }, [account, bid, bidders, bids])
}
