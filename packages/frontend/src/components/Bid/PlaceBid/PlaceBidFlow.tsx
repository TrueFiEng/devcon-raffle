import { formatEther, parseEther } from '@ethersproject/units'
import { useEthers } from '@usedapp/core'
import { useEffect, useMemo, useState } from 'react'
import { AuctionTransaction } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { TransactionAction, Transactions } from 'src/components/Transaction'
import { useBids, useMinimumBid } from 'src/hooks'
import { useBid } from 'src/hooks/transactions'
import { prepareAmountForParsing } from 'src/utils/prepareAmountForParsing'

import { FlowProps } from '../BidFlow'

export const PlaceBidFlow = ({ setTransactionViewLock }: FlowProps) => {
  const { account } = useEthers()
  const [view, setView] = useState<TxFlowSteps>(TxFlowSteps.Placing)
  const minimumBid = useMinimumBid()
  const [bid, setBid] = useState('0')
  const { placeBid, state, resetState } = useBid()
  const { bids } = useBids()

  useEffect(() => setView(TxFlowSteps.Placing), [account])

  useEffect(() => {
    setBid(formatEther(minimumBid))
  }, [minimumBid])

  useEffect(() => {
    if (state.status == 'Success') {
      setBid(formatEther(minimumBid))
    }
  }, [state.status, minimumBid])

  const parsedBid = useMemo(() => parseEther(prepareAmountForParsing(bid || '0')), [bid])
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
        <PlaceBidForm
          bid={bid}
          parsedBid={parsedBid}
          setBid={setBid}
          setView={setView}
          minimumBid={minimumBid}
          bids={bids}
        />
      ) : (
        <AuctionTransaction
          action={bidAction}
          amount={parsedBid}
          view={view}
          setView={setView}
          setTransactionViewLock={setTransactionViewLock}
        />
      )}
    </>
  )
}
