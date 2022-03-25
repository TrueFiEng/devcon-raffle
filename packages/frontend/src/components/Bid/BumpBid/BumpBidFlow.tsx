import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBids } from 'src/hooks/useBids'
import type { BidWithPlace } from 'src/models/Bid'

interface BumpBidFlowProps {
  userBid: BidWithPlace
}

export const BumpBidFlow = ({ userBid }: BumpBidFlowProps) => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const [newBid, setNewBid] = useState(userBid.amount)
  const { bids } = useBids()
  const BumpBidAction = Transactions.Bump

  return (
    <>
      {view === BidFlowSteps.Placing ? (
        <BumpBidForm userBid={userBid} newBid={newBid} setBid={setNewBid} setView={setView} bids={bids} />
      ) : (
        <AuctionTransaction
          action={BumpBidAction}
          amount={userBid.amount}
          impact={newBid}
          view={view}
          setView={setView}
        />
      )}
    </>
  )
}
