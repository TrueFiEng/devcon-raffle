import { Record as ImmutableRecord } from 'immutable'
import { createContext } from 'react'

import { BidsState, getDefaultBidsState } from './reducer'

export interface BidsContext {
  bidsState: ImmutableRecord<BidsState>
}

export const BidsContext = createContext<BidsContext>({
  bidsState: getDefaultBidsState(),
})
