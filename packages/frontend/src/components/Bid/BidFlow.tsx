import { useEthers } from '@usedapp/core'
import { BidStart } from 'src/components/Bid/BidStart'
import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { WinBidFlow } from 'src/components/Bid/WinBid/WinBidFlow'
import { useBids } from 'src/hooks/useBids'

export const BidFlow = () => {
  const { account } = useEthers()
  const { bids } = useBids()
  const userBid = bids.find((bid) => bid.bidderAddress === account)
  const timeIsOver = false

  return timeIsOver ? (
    <>{userBid ? <WinBidFlow userBid={userBid} /> : <BidStart />}</>
  ) : (
    <>{userBid ? <BumpBidFlow userBid={userBid} /> : <PlaceBidFlow />}</>
  )
}
