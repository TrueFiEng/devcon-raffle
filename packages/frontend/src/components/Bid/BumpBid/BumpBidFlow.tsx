import { formatEther, parseEther } from '@ethersproject/units'
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
  const [bumpAmount, setBumpAmount] = useState(formatEther(minimumIncrement))
  const parsedBumpAmount = useMemo(() => parseEther(bumpAmount || '0'), [bumpAmount])
  const newBidAmount = useMemo(() => {
    return userBid && userBid.amount.add(parsedBumpAmount)
  }, [parsedBumpAmount, userBid])

  useEffect(() => {
    if (state.status == 'None' || state.status == 'Success') {
      setBumpAmount(formatEther(minimumIncrement))
    }
  }, [minimumIncrement, state.status])

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
      {view === TxFlowSteps.Placing && userBid && newBidAmount ? (
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
        />
      )}
    </>
  )
}
