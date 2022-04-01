import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Bid/TxFlowSteps'
import { WinOptions } from 'src/components/Claim/WinBid/WinFlowEnum'
import { WinForm } from 'src/components/Claim/WinBid/WinForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useClaimFunds } from 'src/hooks/transactions/useClaimFunds'
import { Bid } from 'src/models/Bid'

interface WinBidFlowProps {
  userBid: Bid
}

export const WinBidFlow = ({ userBid }: WinBidFlowProps) => {
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const [withdrawnBid, setWithdrawnBid] = useState(false)
  const [voucher, setVoucher] = useState(false)
  const bidderId = BigNumber.from(1)
  const { claimFunds, state, resetState } = useClaimFunds()

  const claimAction: TransactionAction = {
    type: Transactions.Withdraw,
    send: async () => {
      await claimFunds(bidderId)
    },
    state: state,
    resetState: resetState,
  }

  return (
    <>
      {view === TxFlowSteps.Placing ? (
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
        <AuctionTransaction action={claimAction} amount={userBid.amount} view={view} setView={setView} />
      )}
    </>
  )
}
