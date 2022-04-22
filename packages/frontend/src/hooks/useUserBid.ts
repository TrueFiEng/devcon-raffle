import { addressEqual, useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'
import { useBids } from 'src/hooks'
import { useDevconContract } from 'src/hooks/contract'

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

  return bidWithPlace && account
    ? {
        bidderID: bidWithPlace.bidderID,
        bidderAddress: account,
        amount: bid?.amount || bidWithPlace.amount,
        place: bidWithPlace.place,
        winType: bid?.winType || WinType.Loss,
        claimed: bid?.claimed || false,
      }
    : undefined
}
