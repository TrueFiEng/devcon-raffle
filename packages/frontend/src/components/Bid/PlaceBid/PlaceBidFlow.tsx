import { parseEther } from '@ethersproject/units'
import { useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Bid/TxFlowSteps'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { useBids } from 'src/hooks/useBids'

export const PlaceBidFlow = () => {
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const minimumBid = parseEther('0.15')
  const [bid, setBid] = useState(minimumBid)
  const { placeBid, state, resetState } = useBid()
  const { bids } = useBids()

  const bidAction: TransactionAction = {
    type: Transactions.Place,
    send: async () => {
      await placeBid(bid)
    },
    state: state,
    resetState: resetState,
  }

  return (
    <>
      {view === TxFlowSteps.Placing ? (
        <PlaceBidForm bid={bid} setBid={setBid} setView={setView} minimumBid={minimumBid} bids={bids} />
      ) : (
        <AuctionTransaction action={bidAction} amount={bid} view={view} setView={setView} />
      )}
    </>
  )
}
