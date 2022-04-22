import { BigNumber } from '@ethersproject/bignumber'
import { useMemo, useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'
import { WinForm } from 'src/components/Claim/WinBid/WinForm'
import { TransactionAction, Transactions } from 'src/components/Transaction'
import { ZERO } from 'src/constants/bigNumber'
import { useClaimFunds } from 'src/hooks/transactions/useClaimFunds'
import { useMinimumBid } from 'src/hooks/useMinimumBid'
import { UserBid } from 'src/models/Bid'

interface WinBidFlowProps {
  userBid: UserBid
}

export const WinBidFlow = ({ userBid }: WinBidFlowProps) => {
  const minimumBid = useMinimumBid()
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
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
        <WinForm userBid={userBid} withdrawalAmount={withdrawalAmount} setView={setView} />
      ) : (
        <AuctionTransaction action={claimAction} amount={withdrawalAmount} view={view} setView={setView} />
      )}
    </>
  )
}

function calculateWithdrawalAmount(userBid: UserBid, minimumBid: BigNumber) {
  switch (userBid.winType) {
    case WinType.Auction:
      return ZERO
    case WinType.GoldenTicket:
      return userBid.amount
    case WinType.Raffle:
      return userBid.amount.sub(minimumBid)
    default:
      return userBid.amount.mul(98).div(100)
  }
}
