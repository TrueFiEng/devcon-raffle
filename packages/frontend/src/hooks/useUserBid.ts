import { useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'
import { useBids, useDevconParam } from 'src/hooks'
import { useDevconContract } from 'src/hooks/contract'
import { UserBid } from 'src/models/Bid'

export function useUserBid(): UserBid | undefined {
  const { devcon, chainId } = useDevconContract()
  const { devconValue: reservePrice } = useDevconParam('reservePrice')
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

    const shouldUserBeAbleToWithdraw =
      reservePrice && bid.winType == WinType.Raffle && bid.claimed === false ? bid.amount.eq(reservePrice) : bid.claimed

    return {
      ...bidWithPlace,
      ...bid,
      claimed: shouldUserBeAbleToWithdraw,
    }
  }, [account, bid, bidders, bids])
}
