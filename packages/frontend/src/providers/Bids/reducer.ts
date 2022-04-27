import { BigNumber } from '@ethersproject/bignumber'

import { bidFactory, bidsStateFactory, ImmutableBid, ImmutableBidsState } from './types'

export const getDefaultBidsState = (): ImmutableBidsState => {
  return bidsStateFactory({})
}

export interface BidChanged {
  bidderID: BigNumber
  bidderAddress: string
  amount: BigNumber
}

export function bidsReducer(state: ImmutableBidsState, action: BidChanged) {
  const bidIndex = getBidder(state, action.bidderAddress)
  if (bidIndex !== undefined) {
    const currentBid = getBid(state, bidIndex)!
    const currentAmount = currentBid.get('amount')

    if (action.amount.gt(currentAmount)) {
      return updateBid(state, currentBid, action.amount)
    }
    return state
  }

  return addBid(state, action)
}

function updateBid(state: ImmutableBidsState, currentBid: ImmutableBid, newAmount: BigNumber) {
  currentBid = currentBid.set('amount', newAmount)

  const currentPlace = currentBid.get('place')
  if (currentPlace === 1) {
    return setBid(state, 0, currentBid)
  }
  return iterateBids(state, currentBid, currentPlace - 2)
}

function addBid(state: ImmutableBidsState, action: BidChanged) {
  const newBid = bidFactory({
    ...action,
    place: -1,
  })

  const bidsCount = state.get('bids').size
  return iterateBids(state, newBid, bidsCount - 1)
}

function iterateBids(state: ImmutableBidsState, currentBid: ImmutableBid, startIndex: number) {
  for (let i = startIndex; i >= 0; i--) {
    const bid = getBid(state, i)!
    const newPlace = bid.get('place') + 1
    const cmp = compareBids(bid, currentBid)
    if (cmp < 0) {
      // bid.amount > currentBid.amount
      return assignBidPlace(state, currentBid, newPlace)
    }

    state = assignBidPlace(state, bid, newPlace)
  }
  return assignBidPlace(state, currentBid, 1)
}

function assignBidPlace(state: ImmutableBidsState, bid: ImmutableBid, place: number) {
  bid = bid.set('place', place)

  const index = place - 1
  state = setBid(state, index, bid)
  state = setBidder(state, bid.get('bidderAddress'), index)
  return state
}

// TODO: import from contracts package
function compareBids(a: ImmutableBid, b: ImmutableBid) {
  const amountCmp = biggerFirst(a.get('amount'), b.get('amount'))
  if (amountCmp !== 0) {
    return amountCmp
  }
  return -biggerFirst(BigNumber.from(a.get('bidderID')), BigNumber.from(b.get('bidderID')))
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

function getBid(state: ImmutableBidsState, index: number) {
  return state.get('bids').get(index)
}

function setBid(state: ImmutableBidsState, index: number, bid: ImmutableBid) {
  let bids = state.get('bids')
  bids = bids.set(index, bid)
  return state.set('bids', bids)
}

function getBidder(state: ImmutableBidsState, bidderAddress: string) {
  return state.get('bidders').get(bidderAddress)
}

function setBidder(state: ImmutableBidsState, bidderAddress: string, index: number) {
  let bidders = state.get('bidders')
  bidders = bidders.set(bidderAddress, index)
  return state.set('bidders', bidders)
}
