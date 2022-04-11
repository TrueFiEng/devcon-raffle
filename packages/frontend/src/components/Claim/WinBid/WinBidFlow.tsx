import { BigNumber } from '@ethersproject/bignumber'
import { useMemo, useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { WinOptions } from 'src/components/Claim/WinBid/WinFlowEnum'
import { WinForm } from 'src/components/Claim/WinBid/WinForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { ZERO } from 'src/constants/bigNumber'
import { useClaimFunds } from 'src/hooks/transactions/useClaimFunds'
import { useMinimumBid } from 'src/hooks/useMinimumBid'
import { SettledBid } from 'src/models/Bid'

interface WinBidFlowProps {
  userBid: SettledBid
}

export const WinBidFlow = ({ userBid }: WinBidFlowProps) => {
  const minimumBid = useMinimumBid()
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const [voucher, setVoucher] = useState(false)
  const { claimFunds, state, resetState } = useClaimFunds()

  const withdrawalAmount = useMemo(() => calculateWithdrawalAmount(userBid, minimumBid), [userBid, minimumBid])

  const claimAction: TransactionAction = {
    type: Transactions.Withdraw,
    send: async () => {
      await claimFunds(userBid.bidderID)
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

function calculateWithdrawalAmount(userBid: SettledBid, minimumBid: BigNumber) {
  switch (userBid.winType) {
    case WinOptions.Auction:
      return ZERO
    case WinOptions.Ticket:
      return userBid.amount
    case WinOptions.Raffle:
      return userBid.amount.sub(minimumBid)
    default:
      return userBid.amount.mul(98).div(100)
  }
}
