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
      return updateBid(state, currentBid, action.amount)
    }
    return state
  }
  return addBid(state, action)
}

function updateBid(state: BidsState, bid: Bid, newAmount: BigNumber) {
  bid.amount = newAmount
  if (bid.place === 1) {
    return state
  }

  return iterateBids(state, bid, bid.place - 2)
}

function addBid(state: BidsState, action: BidChanged) {
  const newBid: Bid = {
    ...action,
    place: -1,
  }

  if (state.bids.length === 0) {
    return assignBidPlace(state, newBid, 1)
  }

  return iterateBids(state, newBid, state.bids.length - 1)
}

function iterateBids(state: BidsState, bid: Bid, startIndex: number) {
  for (let i = startIndex; i >= 0; i--) {
    const currentBid = state.bids[i]
    const cmp = compareBids(bid, currentBid)
    //bid.amount < currentBid.amount
    if (cmp > 0) {
      return assignBidPlace(state, bid, currentBid.place + 1)
    }

    currentBid.place += 1
    state.bidders.set(currentBid.bidderAddress, i + 1)

    if (i === 0) {
      return assignBidPlace(state, bid, 1)
    }
  }
  return state
}

function assignBidPlace(state: BidsState, bid: Bid, place: number) {
  const index = place - 1
  bid.place = place
  state.bids.splice(index, 0, bid)
  state.bidders.set(bid.bidderAddress, index)
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
