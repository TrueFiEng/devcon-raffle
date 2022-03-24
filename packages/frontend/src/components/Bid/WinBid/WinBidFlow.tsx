import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { WinOptions } from 'src/components/Bid/WinBid/WinFlowEnum'
import { WinForm } from 'src/components/Bid/WinBid/WinForm'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { Bid } from 'src/models/Bid'

interface WinBidFlowProps {
  userBid: Bid
}

export const WinBidFlow = ({ userBid }: WinBidFlowProps) => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const WinBidAction = Transactions.Withdraw
  const [withdrawnBid, setWithdrawnBid] = useState(false)
  const [voucher, setVoucher] = useState(false)

  return (
    <>
      {view === BidFlowSteps.Placing ? (
        <WinForm
          bid={userBid.amount}
          setView={setView}
          win={WinOptions.Ticket}
          withdrawnBid={withdrawnBid}
          setWithdrawnBid={setWithdrawnBid}
          voucher={voucher}
          setVoucher={setVoucher}
        />
      ) : (
        <AuctionTransaction action={WinBidAction} amount={userBid.amount} view={view} setView={setView} />
      )}
    </>
  )
}
