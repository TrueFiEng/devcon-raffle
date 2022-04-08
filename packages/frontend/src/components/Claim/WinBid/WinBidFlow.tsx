import { BigNumber } from '@ethersproject/bignumber'
import { useMemo, useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { WinForm } from 'src/components/Claim/WinBid/WinForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useClaimFunds } from 'src/hooks/transactions/useClaimFunds'
import { SettledBid } from 'src/models/Bid'

interface WinBidFlowProps {
  userBid: SettledBid
}

export const WinBidFlow = ({ userBid }: WinBidFlowProps) => {
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const [voucher, setVoucher] = useState(false)
  const bidderId = BigNumber.from(1)
  const { claimFunds, state, resetState } = useClaimFunds()

  const withdrawalAmount = useMemo(() => userBid.amount.mul(98).div(100), [userBid])

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
          userBid={userBid}
          withdrawalAmount={withdrawalAmount}
          setView={setView}
          voucher={voucher}
          setVoucher={setVoucher}
        />
      ) : (
        <AuctionTransaction action={claimAction} amount={withdrawalAmount} view={view} setView={setView} />
      )}
    </>
  )
}
