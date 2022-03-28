import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { Bid } from 'src/models/Bid'

interface BumpBidFlowProps {
  userBid: Bid
}

export const BumpBidFlow = ({ userBid }: BumpBidFlowProps) => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const [newBid, setNewBid] = useState(userBid.amount)
  const { placeBid, state } = useBid()

  const bumpAction: TransactionAction = {
    type: Transactions.Bump,
    send: async () => {
      await placeBid(userBid.amount)
    },
    state: state,
  }

  return (
    <>
      {view === BidFlowSteps.Placing ? (
        <BumpBidForm userBid={userBid} newBid={newBid} setBid={setNewBid} setView={setView} />
      ) : (
        <AuctionTransaction action={bumpAction} amount={userBid.amount} impact={newBid} view={view} setView={setView} />
      )}
    </>
  )
}
