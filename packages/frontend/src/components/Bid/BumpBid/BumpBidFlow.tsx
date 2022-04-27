import { useEffect, useMemo, useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { useBids } from 'src/hooks/useBids'
import { useMinimumIncrement } from 'src/hooks/useMinimumIncrement'
import { useUserBid } from 'src/hooks/useUserBid'
import { useEthers } from '@usedapp/core'

export const BumpBidFlow = () => {
  const { account } = useEthers()
  const userBid = useUserBid()
  const minimumIncrement = useMinimumIncrement()
  const { placeBid, state, resetState } = useBid()
  const { bids } = useBids()
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const [bumpAmount, setBumpAmount] = useState(minimumIncrement)
  const newBidAmount = useMemo(() => {
    return userBid && userBid.amount.add(bumpAmount)
  }, [bumpAmount, userBid])

  useEffect(() => setView(TxFlowSteps.Placing), [account])

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
      {view === TxFlowSteps.Placing && userBid && newBidAmount ? (
        <BumpBidForm
          userBid={userBid}
          newBidAmount={newBidAmount}
          bumpAmount={bumpAmount}
          setBumpAmount={setBumpAmount}
          minimumIncrement={minimumIncrement}
          setView={setView}
          bids={bids}
        />
      ) : (
        <AuctionTransaction
          action={bumpAction}
          amount={bumpAmount}
          impact={newBidAmount}
          view={view}
          setView={setView}
        />
      )}
    </>
  )
}
