import { formatEther, parseEther } from "@ethersproject/units";
import { useEffect, useMemo, useState } from "react";
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { useBids } from 'src/hooks/useBids'
import { useMinimumBid } from 'src/hooks/useMinimumBid'

interface PlaceBidFlowProps {
  endInitialBidding: () => void
}

export const PlaceBidFlow = ({ endInitialBidding }: PlaceBidFlowProps) => {
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const minimumBid = useMinimumBid()
  const [bid, setBid] = useState('0')
  const { placeBid, state, resetState } = useBid()
  const { bids } = useBids()

  useEffect(() => setBid(formatEther(minimumBid)), [minimumBid])

  const parsedBid = useMemo(() => parseEther(bid == '' ? '0' : bid), [bid])
  const bidAction: TransactionAction = {
    type: Transactions.Place,
    send: async () => {
      await placeBid(parsedBid)
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
          amount={parsedBid}
          view={view}
          setView={setView}
          endInitialBidding={endInitialBidding}
        />
      )}
    </>
  )
}
