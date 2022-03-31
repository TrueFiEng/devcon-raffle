import { BidStart } from 'src/components/Bid/BidStart'
import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { WinBidFlow } from 'src/components/Bid/WinBid/WinBidFlow'
import { useUserBid } from 'src/hooks/useUserBid'

import { useAuctionTime } from '../../hooks/useAuctionTime'

export const BidFlow = () => {
  const {value, error } = useAuctionTime()
  console.log(value)
  console.log(error)
  const userBid = useUserBid()
  const timeIsOver = false

  return timeIsOver ? (
    <>{userBid ? <WinBidFlow userBid={userBid} /> : <BidStart />}</>
  ) : (
    <>{userBid ? <BumpBidFlow userBid={userBid} /> : <PlaceBidFlow />}</>
  )
}
