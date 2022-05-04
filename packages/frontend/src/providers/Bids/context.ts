import { createContext } from 'react'

import { getDefaultBidsState } from './reducer'
import { ImmutableBidsState } from './types'

export interface BidsContext {
  bidsState: ImmutableBidsState
}

export const BidsContext = createContext<BidsContext>({
  bidsState: getDefaultBidsState(),
})
