import { useEthers } from '@usedapp/core'
import { bids } from 'src/data/bids'

import { BumpBidFlow } from './BumpBid/BumpBidFlow'
import { PlaceBidFlow } from './PlaceBid/PlaceBidFlow'

export const BidFlow = () => {
  const { account } = useEthers()

  const userBid = bids.find((bid) => bid.bidderAddress === account)
  console.log(bids)

  return <>{userBid ? <BumpBidFlow userBid={userBid} /> : <PlaceBidFlow />}</>
}
