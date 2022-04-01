import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { useUserBid } from 'src/hooks/useUserBid'

export const BidFlow = () => {
  const userBid = useUserBid()

  return userBid ? <BumpBidFlow userBid={userBid} /> : <PlaceBidFlow />
}
