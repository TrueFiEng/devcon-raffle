// import { useEthers } from '@usedapp/core'
import { BidStart } from 'src/components/Bid/BidStart'
import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { WinBidFlow } from 'src/components/Bid/WinBid/WinBidFlow'
import { bids } from 'src/data/bids'

export const BidFlow = () => {
  // For test bump flow
  // const { account } = useEthers()
  // const userBid = bids.find((bid) => bid.bidderAddress === account)

  // For test win withdraw flow
  const userBid = bids[1]

  // Test time
  const timeIsOver = false

  return timeIsOver ? (
    <>{userBid ? <WinBidFlow userBid={userBid} /> : <BidStart />}</>
  ) : (
    <>{userBid ? <BumpBidFlow userBid={userBid} /> : <PlaceBidFlow />}</>
  )
}
