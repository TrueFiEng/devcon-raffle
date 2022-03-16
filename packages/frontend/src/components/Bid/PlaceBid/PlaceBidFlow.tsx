import { parseEther } from '@ethersproject/units'
import { useState } from 'react'
import { Transactions } from 'src/components/Auction/AuctionEnum'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { bids } from 'src/data/bids'

export const PlaceBidFlow = () => {
  const [view, setView] = useState<BidFlow>(BidFlow.Placing)
  const minimumBid = parseEther('0.15')
  const [bid, setBid] = useState(minimumBid)
  const placeBidAction = Transactions.Place

  return (
    <>
      {view === BidFlow.Placing ? (
        <PlaceBidForm bid={bid} setBid={setBid} setView={setView} minimumBid={minimumBid} bids={bids} />
      ) : (
        <AuctionTransaction action={placeBidAction} amount={bid} view={view} setView={setView} />
      )}
    </>
  )
}
