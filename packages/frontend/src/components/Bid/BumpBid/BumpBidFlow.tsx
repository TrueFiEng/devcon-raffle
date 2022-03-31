import { parseEther } from '@ethersproject/units'
import { useMemo, useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { useBids } from 'src/hooks/useBids'
import type { BidWithPlace } from 'src/models/Bid'

interface BumpBidFlowProps {
  userBid: BidWithPlace
}

export const BumpBidFlow = ({ userBid }: BumpBidFlowProps) => {
  const minimumIncrement = parseEther('0.01')
  const { placeBid, state, resetState } = useBid()
  const { bids } = useBids()
  const [view, setView] = useState<BidFlowSteps>(BidFlowSteps.Placing)
  const [bumpAmount, setBumpAmount] = useState(minimumIncrement)
  const newBid = useMemo(() => {
    return userBid.amount.add(bumpAmount)
  }, [bumpAmount, userBid.amount])

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
      {view === BidFlowSteps.Placing ? (
        <BumpBidForm
          userBid={userBid}
          newBid={newBid}
          bumpAmount={bumpAmount}
          setBumpAmount={setBumpAmount}
          setView={setView}
          bids={bids}
        />
      ) : (
        <AuctionTransaction action={bumpAction} amount={bumpAmount} impact={newBid} view={view} setView={setView} />
      )}
    </>
  )
}
