import { parseEther } from '@ethersproject/units'
import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBids } from 'src/hooks/useBids'

export const PlaceBidFlow = () => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const minimumBid = parseEther('0.15')
  const [bid, setBid] = useState(minimumBid)
  const placeBidAction = Transactions.Place
  const { bids } = useBids()

  return (
    <>
      {view === BidFlowSteps.Placing ? (
        <PlaceBidForm bid={bid} setBid={setBid} setView={setView} minimumBid={minimumBid} bids={bids} />
      ) : (
        <AuctionTransaction action={placeBidAction} amount={bid} view={view} setView={setView} />
      )}
    </>
  )
}
