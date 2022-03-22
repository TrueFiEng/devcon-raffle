import { ReactNode, useEffect, useState } from 'react'
import { Bid, BidWithPlace } from 'src/models/Bid'
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
  const bidsFromEvents = useBidEvents()
  const [bids, setBids] = useState<BidWithPlace[]>([])
  const awaitBids = async () =>
    await bidsFromEvents.then((bids) =>
      setBids(bids.sort(compareBids).map((bid, index) => ({ ...bid, place: index + 1 })))
    )
  useEffect(() => {
    awaitBids()
  }, [])

  return <BidsContext.Provider value={{ bids }}>{children}</BidsContext.Provider>
}
