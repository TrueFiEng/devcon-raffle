import { useCallback, useState } from 'react'
import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { useSettledBid } from 'src/hooks/useSettledBid'

export const BidFlow = () => {
  const userBid = useSettledBid()
  const [isInitialBid, setIsInitialBid] = useState(!userBid)
  const endInitialBidding = useCallback(() => setIsInitialBid(false), [setIsInitialBid])
  return isInitialBid ? <PlaceBidFlow endInitialBidding={endInitialBidding} /> : <BumpBidFlow />
}
