import { createContext } from 'react'
import { Bid } from 'src/models/Bid'

interface BidsContext {
  bids: Bid[]
}

export const BidsContext = createContext<BidsContext>({
  bids: [],
})
