import { createContext } from 'react'

import { BidsState, getDefaultBidsState } from './reducer'

export interface BidsContext {
  bidsState: BidsState
}

export const BidsContext = createContext<BidsContext>({
  bidsState: getDefaultBidsState(),
})
