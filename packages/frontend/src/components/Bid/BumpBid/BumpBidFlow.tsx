import { useMemo, useState, useEffect } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { useBids } from 'src/hooks/useBids'
import { useMinimumIncrement } from 'src/hooks/useMinimumIncrement'
import { useUserBid } from 'src/hooks/useUserBid'

export const BumpBidFlow = () => {
  const userBid = useUserBid()
  const minimumIncrement = useMinimumIncrement()
  const { placeBid, state, resetState } = useBid()
  const { bids } = useBids()
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const [bumpAmount, setBumpAmount] = useState(minimumIncrement)
  const newBid = useMemo(() => {
    return userBid && userBid.amount.add(bumpAmount)
  }, [bumpAmount, userBid])

  useEffect(() => setBumpAmount(minimumIncrement), [minimumIncrement, setBumpAmount])

  const bumpAction: TransactionAction = {
    type: Transactions.Bump,
    send: async () => {
      await placeBid(bumpAmount)
    },
    state: state,
    resetState: resetState,
  }

  return (
    <>
      {view === TxFlowSteps.Placing && userBid && newBid ? (
        <BumpBidForm
          userBid={userBid}
          newBid={newBid}
          bumpAmount={bumpAmount}
          setBumpAmount={setBumpAmount}
          minimumIncrement={minimumIncrement}
          setView={setView}
          bids={bids}
        />
      ) : (
        <AuctionTransaction action={bumpAction} amount={bumpAmount} impact={newBid} view={view} setView={setView} />
      )}
    </>
  )
}
