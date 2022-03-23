import { createContext } from 'react'
import { BidWithPlace } from 'src/models/Bid'

interface BidsContext {
  bids: BidWithPlace[]
}

export const BidsContext = createContext<BidsContext>({
  bids: [],
})
