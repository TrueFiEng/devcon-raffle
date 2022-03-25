import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { WinOptions } from 'src/components/Bid/WinBid/WinFlowEnum'
import { WinForm } from 'src/components/Bid/WinBid/WinForm'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useClaimFunds } from 'src/hooks/transactions/useClaimFunds'
import { TransactionAction } from 'src/models/TransactionAction'
import { Bid } from 'src/models/Bid'

interface WinBidFlowProps {
  userBid: Bid
}

export const WinBidFlow = ({ userBid }: WinBidFlowProps) => {
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const [withdrawnBid, setWithdrawnBid] = useState(false)
  const [voucher, setVoucher] = useState(false)
  const bidderId = BigNumber.from(1)
  const { claimFunds, state } = useClaimFunds()

  const WinAction: TransactionAction = {
    type: Transactions.Withdraw,
    send: async () => {
      await claimFunds(bidderId)
    },
    state: state,
  }

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
        <AuctionTransaction action={WinAction} amount={userBid.amount} view={view} setView={setView} />
      )}
    </>
  )
}
