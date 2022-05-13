import { useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'
import { useBids } from 'src/hooks'
import { useDevconContract } from 'src/hooks/contract'
import { UserBid } from 'src/models/Bid'

export function useUserBid(): UserBid | undefined {
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
        ...bidWithPlace,
        winType: WinType.Loss,
        claimed: false,
      }
    }

    return {
      ...bidWithPlace,
      ...bid,
    }
  }, [account, bid, bidders, bids])
}
