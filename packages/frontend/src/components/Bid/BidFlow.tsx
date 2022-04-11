import { useCallback, useState } from 'react'
import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { useUserBid } from 'src/hooks/useUserBid'

export const BidFlow = () => {
  const userBid = useUserBid()
  const [isInitialBid, setIsInitialBid] = useState(!userBid)
  const endInitialBidding = useCallback(() => setIsInitialBid(false), [setIsInitialBid])
  return isInitialBid ? <PlaceBidFlow endInitialBidding={endInitialBidding} /> : <BumpBidFlow />
}
