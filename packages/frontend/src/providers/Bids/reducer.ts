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
  amount: BigNumber
}

export function bidsReducer(state: BidsState = getDefaultBidsState(), action: BidChanged) {
  const bidIndex = state.bidders.get(action.bidderAddress)
  if (bidIndex !== undefined) {
    const currentBid = state.bids[bidIndex]
    if (action.amount.gt(currentBid.amount)) {
      return state
    }
    return state
  }
  return addNewBid(state, action)
}

function addNewBid(state: BidsState, action: BidChanged) {
  const newBid: Bid = {
    bidderID: action.bidderID,
    bidderAddress: action.bidderAddress,
    amount: action.amount,
    place: -1,
  }

  if (state.bids.length === 0) {
    newBid.place = 1
    state.bids.push(newBid)
    state.bidders.set(newBid.bidderAddress, 0)
    return state
  }

  for (let i = state.bids.length - 1; i >= 0; i--) {
    const currentBid = state.bids[i]
    const cmp = compareBids(newBid, currentBid)
    //newBid.amount < currentBid.amount
    if (cmp > 0) {
      newBid.place = currentBid.place + 1
      state.bids.splice(i + 1, 0, newBid)
      state.bidders.set(newBid.bidderAddress, i)
      return state
    }

    currentBid.place += 1
    state.bidders.set(currentBid.bidderAddress, i + 1)

    if (i === 0) {
      newBid.place = 1
      state.bids.splice(0, 0, newBid)
      state.bidders.set(newBid.bidderAddress, 0)
    }
  }
  return state
}

// TODO: import from contracts package
function compareBids(a: Bid, b: Bid) {
  const amountCmp = biggerFirst(a.amount, b.amount)
  if (amountCmp !== 0) {
    return amountCmp
  }
  return -biggerFirst(BigNumber.from(a.bidderID), BigNumber.from(b.bidderID))
}

export function biggerFirst(a: BigNumber, b: BigNumber) {
  if (a.eq(b)) {
    return 0
  }
  if (a.gt(b)) {
    return -1
  }
  return 1
}
