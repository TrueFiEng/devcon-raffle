import { useState } from 'react'
import { Transactions } from 'src/components/Auction/AuctionEnum'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { Bid } from 'src/models/Bid'

interface BumpBidFlowProps {
  userBid: Bid
}

export const BumpBidFlow = ({ userBid }: BumpBidFlowProps) => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const [newBid, setNewBid] = useState(userBid.amount)
  const BumpBidAction = Transactions.Bump

  return (
    <>
      {view === BidFlowSteps.Placing ? (
        <BumpBidForm userBid={userBid} newBid={newBid} setBid={setNewBid} setView={setView} />
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
