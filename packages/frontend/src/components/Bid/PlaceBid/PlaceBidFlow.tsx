import { useEthers } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { useBids } from 'src/hooks/useBids'
import { useMinimumBid } from 'src/hooks/useMinimumBid'

import { ZERO } from '../../../constants/bigNumber'

interface PlaceBidFlowProps {
  endInitialBidding: () => void
}

export const PlaceBidFlow = ({ endInitialBidding }: PlaceBidFlowProps) => {
  const { account } = useEthers()
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const minimumBid = useMinimumBid()
  const [bid, setBid] = useState(ZERO)
  const { placeBid, state, resetState } = useBid()
  const { bids } = useBids()

  useEffect(() => setView(TxFlowSteps.Placing), [account])

  useEffect(() => setBid(minimumBid), [minimumBid])

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
        <AuctionTransaction
          action={bidAction}
          amount={bid}
          view={view}
          setView={setView}
          endInitialBidding={endInitialBidding}
        />
      )}
    </>
  )
}
