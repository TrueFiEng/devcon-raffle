import { parseEther } from '@ethersproject/units'
import { useState } from 'react'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { PlaceBidConfirmation } from 'src/components/Bid/PlaceBid/PlaceBidConfirmation'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { PlaceBidReview } from 'src/components/Bid/PlaceBid/PlaceBidReview'
import { bids } from 'src/data/bids'

export const PlaceBidFlow = () => {
  const [view, setView] = useState<BidFlow>(BidFlow.Placing)
  const minimumBid = parseEther('0.15')
  const [bid, setBid] = useState(minimumBid)
  
  return (
    <>
      {view === BidFlow.Placing && (
        <PlaceBidForm bid={bid} setBid={setBid} setView={setView} minimumBid={minimumBid} bids={bids} />
      )}
      {view === BidFlow.Review && <PlaceBidReview bid={bid} view={view} setView={setView} />}
      {view === BidFlow.Confirmation && <PlaceBidConfirmation view={view} setView={setView} />}
    </>
  )
}
