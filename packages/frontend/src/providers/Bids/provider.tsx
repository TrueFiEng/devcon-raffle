import { Interface } from '@ethersproject/abi'
import { ReactNode, useMemo } from 'react'
import { DEVCON6_ABI } from 'src/constants/abis'
import { Bid } from 'src/models/Bid'
import { useBidEvents } from 'src/providers/Bids/useBidEvents'

import { BidsContext } from './context'

interface Props {
  children: ReactNode
}

function compareBids(a: Bid, b: Bid) {
  if (a.amount.lt(b.amount)) {
    return -1
  }
  return a.amount.gt(b.amount) ? 1 : 0
}

export const BidsProvider = ({ children }: Props) => {
  const abi = new Interface(DEVCON6_ABI)
  const bidsEvents = useBidEvents()

  const bids = useMemo(() => {
    return bidsEvents
      .map((log) => {
        const event = abi.parseLog(log)
        const bid: Bid = { bidderAddress: event.args.bidder, amount: event.args.bidAmount }
        return bid
      })
      .sort(compareBids)
      .map((bid, index) => ({ ...bid, place: index + 1 }))
  }, [bidsEvents.length])

  return <BidsContext.Provider value={{ bids }}>{children}</BidsContext.Provider>
}
