import { formatEther, parseEther } from '@ethersproject/units'
import { useEthers } from '@usedapp/core'
import { useMemo, useState, useEffect } from 'react'
import { AuctionTransaction, TxFlowSteps } from 'src/components/Auction'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { TransactionAction, Transactions } from 'src/components/Transaction'
import { useBids, useMinimumIncrement, useUserBid } from 'src/hooks'
import { useBid } from 'src/hooks/transactions'
import { prepareAmountForParsing } from 'src/utils/prepareAmountForParsing'

import { FlowProps } from '../BidFlow'

export const BumpBidFlow = ({ setTransactionViewLock }: FlowProps) => {
  const { account } = useEthers()
  const userBid = useUserBid()
  const minimumIncrement = useMinimumIncrement()
  const { placeBid, state, resetState } = useBid()
  const { bids } = useBids()
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const [bumpAmount, setBumpAmount] = useState(formatEther(minimumIncrement))
  const parsedBumpAmount = useMemo(() => parseEther(prepareAmountForParsing(bumpAmount)), [bumpAmount])
  const newBidAmount = useMemo(() => {
    return userBid && userBid.amount.add(parsedBumpAmount)
  }, [parsedBumpAmount, userBid])

  useEffect(() => setView(TxFlowSteps.Placing), [account])

  useEffect(() => {
    setBumpAmount(formatEther(minimumIncrement))
  }, [minimumIncrement])

  useEffect(() => {
    if (state.status == 'Success') {
      setBumpAmount(formatEther(minimumIncrement))
    }
  }, [state.status, minimumIncrement])

  const bumpAction: TransactionAction = {
    type: Transactions.Bump,
    send: async () => {
      await placeBid(parsedBumpAmount)
    },
    state: state,
    resetState: resetState,
  }

  return (
    <>
      {view === TxFlowSteps.Placing ? (
        <BumpBidForm
          userBid={userBid}
          newBidAmount={newBidAmount}
          bumpAmount={bumpAmount}
          parsedBumpAmount={parsedBumpAmount}
          setBumpAmount={setBumpAmount}
          minimumIncrement={minimumIncrement}
          setView={setView}
          bids={bids}
        />
      ) : (
        <AuctionTransaction
          action={bumpAction}
          amount={parsedBumpAmount}
          impact={newBidAmount}
          view={view}
          setView={setView}
          setTransactionViewLock={setTransactionViewLock}
        />
      )}
    </>
  )
}
