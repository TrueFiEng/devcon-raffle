import { parseEther } from '@ethersproject/units'
import { useState } from 'react'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { bids } from 'src/data/bids'

export const PlaceBidFlow = () => {
  const [view, setView] = useState<BidFlow>(BidFlow.Placing)
  return (
    <>
      {view === BidFlow.Placing && <PlaceBidForm setView={setView} minimumBid={parseEther('0.15')} bids={bids} />}
      {view === BidFlow.Review && <h3>Place Bid Review</h3>}
      {view === BidFlow.Confirmation && <h3>Place Bid Confirmation</h3>}
    </>
  )
}
