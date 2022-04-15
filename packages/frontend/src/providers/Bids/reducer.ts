import { BigNumber } from '@ethersproject/bignumber'

import { Bid } from '../../models/Bid'

export interface BidsState {
  bids: Bid[]
  bidders: Map<string, number>
}

export const getDefaultBidsState = (): BidsState => ({
  bids: [],
  bidders: new Map(),
})

export interface BidChanged {
  bidderID: BigNumber
  bidderAddress: string
  newAmount: BigNumber
}

export function bidsReducer(state: BidsState = getDefaultBidsState(), action: BidChanged) {
  const bidIndex = state.bidders.get(action.bidderAddress)
  if (bidIndex !== undefined) {
    const currentBid = state.bids[bidIndex]
    if (action.newAmount.gt(currentBid.amount)) {

    }
  }
  return state
}
