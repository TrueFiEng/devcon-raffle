import { parseEther } from '@ethersproject/units'
import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { bids } from 'src/data/bids'
import { useBid } from 'src/hooks/transactions/useBid'
import { TransactionAction } from 'src/models/TransactionAction'

export const PlaceBidFlow = () => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const minimumBid = parseEther('0.15')
  const [bid, setBid] = useState(minimumBid)
  const { placeBid, state } = useBid()

  const BidAction: TransactionAction = {
    type: Transactions.Place,
    send: async () => {
      await placeBid(bid)
    },
    state: state,
  }
  return (
    <>
      {view === BidFlowSteps.Placing ? (
        <PlaceBidForm bid={bid} setBid={setBid} setView={setView} minimumBid={minimumBid} bids={bids} />
      ) : (
        <AuctionTransaction action={BidAction} amount={bid} view={view} setView={setView} />
      )}
    </>
  )
}
