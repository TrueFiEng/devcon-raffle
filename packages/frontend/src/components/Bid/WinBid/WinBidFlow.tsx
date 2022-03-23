import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { WinBidForm } from 'src/components/Bid/WinBid/WinBidForm'
import { WinOptions } from 'src/components/Bid/WinBid/WinFlowEnum'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { Bid } from 'src/models/Bid'

interface WinBidFlowProps {
  userBid: Bid
}

export const WinBidFlow = ({ userBid }: WinBidFlowProps) => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const WinBidAction = Transactions.Withdraw
  const [withdrawnBid, setWithdrawnBid] = useState(false)

  return (
    <>
      {view === BidFlowSteps.Placing ? (
        <WinBidForm
          bid={userBid.amount}
          setView={setView}
          win={WinOptions.Ticket}
          withdrawnBid={withdrawnBid}
          setWithdrawnBid={setWithdrawnBid}
        />
      ) : (
        <AuctionTransaction action={WinBidAction} amount={userBid.amount} view={view} setView={setView} />
      )}
    </>
  )
}
