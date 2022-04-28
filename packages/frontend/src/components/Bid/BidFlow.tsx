import { useEthers } from '@usedapp/core'
import { useCallback, useEffect, useState } from 'react'
import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { useUserBid } from 'src/hooks/useUserBid'

export const BidFlow = () => {
  const { account } = useEthers()
  const userBid = useUserBid()
  const [isInitialBid, setIsInitialBid] = useState(!userBid)
  const endInitialBidding = useCallback(() => setIsInitialBid(false), [setIsInitialBid])
  useEffect(() => setIsInitialBid(!userBid), [account]) // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: useUserBids returns actual user bid after this component is rendered
  // it causes displaying PlaceBidFlow for users that have already placed bid
  return isInitialBid ? <PlaceBidFlow endInitialBidding={endInitialBidding} /> : <BumpBidFlow />
}
