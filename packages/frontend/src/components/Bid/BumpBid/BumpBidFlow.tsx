import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { useBids } from 'src/hooks/useBids'
import type { BidWithPlace } from 'src/models/Bid'

interface BumpBidFlowProps {
  userBid: BidWithPlace
}

export const BumpBidFlow = ({ userBid }: BumpBidFlowProps) => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const [newBid, setNewBid] = useState(userBid.amount)
  const { placeBid, state } = useBid()
  const { bids } = useBids()
  const bumpBidAmount = newBid.sub(userBid.amount)

  const bumpAction: TransactionAction = {
    type: Transactions.Bump,
    send: async () => {
      await placeBid(bumpBidAmount)
    },
    state: state,
  }

  return (
    <>
      {view === BidFlowSteps.Placing ? (
        <BumpBidForm userBid={userBid} newBid={newBid} setBid={setNewBid} setView={setView} bids={bids} />
      ) : (
        <AuctionTransaction action={bumpAction} amount={bumpBidAmount} impact={newBid} view={view} setView={setView} />
      )}
    </>
  )
}
