import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { NoBidding } from 'src/components/Bid/NoBidding'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { WinBidFlow } from 'src/components/Bid/WinBid/WinBidFlow'
import { useUserBid } from 'src/hooks/useUserBid'

export const BidFlow = () => {
  const userBid = useUserBid()
  const timeIsOver = false

  return timeIsOver ? (
    userBid ? (
      <WinBidFlow userBid={userBid} />
    ) : (
      <NoBidding />
    )
  ) : (
    <>{userBid ? <BumpBidFlow userBid={userBid} /> : <PlaceBidFlow />}</>
  )
}
