/* eslint-disable jest/expect-expect */
// Some tests run assertions in external functions

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { parseEther } from '@ethersproject/units'
import { BidChanged, bidsReducer } from 'src/providers/Bids/reducer'
import { ImmutableBidsState } from 'src/providers/Bids/types'

import { generateMockBidsState, mockBidsAddresses } from '../../mocks/generateMockBids'

describe('bidsReducer', () => {
  it('adds first bid', () => {
    const bidsState = generateMockBidsState(0)
    const change = newBidChanged(1, mockBidsAddresses[0], 100)
    const state = bidsReducer(bidsState, change)

    verifyBid(state, change, 1)
  })

  it('adds new bid as first', () => {
    const bidsState = generateMockBidsState(1)
    const change = newBidChanged(2, mockBidsAddresses[1], parseEther('1.5'))
    const state = bidsReducer(bidsState, change)

    verifyBid(state, change, 1)
  })

  it('adds new bid in middle', () => {
    const bidsState = generateMockBidsState(2)
    const change = newBidChanged(3, mockBidsAddresses[2], parseEther('1.5'))
    const state = bidsReducer(bidsState, change)

    verifyBid(state, change, 2)
  })

  it('adds new bid as last', () => {
    const bidsState = generateMockBidsState(1)
    const change = newBidChanged(2, mockBidsAddresses[1], parseEther('0.5'))
    const state = bidsReducer(bidsState, change)

    verifyBid(state, change, 2)
  })

  it('adds new bid with same amount', () => {
    const bidsState = generateMockBidsState(3)
    const change = newBidChanged(4, mockBidsAddresses[3], parseEther('2'))
    const state = bidsReducer(bidsState, change)

    verifyBid(state, change, 3)
  })

  it('bumps bid', () => {
    const bidsState = generateMockBidsState(3)
    const change = newBidChanged(3, mockBidsAddresses[2], parseEther('10'))
    const state = bidsReducer(bidsState, change)

    verifyBid(state, change, 1)
  })

  it('updates intermediate bids places on bid bump', () => {
    const bidsState = generateMockBidsState(3)
    const change = newBidChanged(3, mockBidsAddresses[2], parseEther('10'))
    const state = bidsReducer(bidsState, change)

    verifyBid(state, change, 1)
    verifyBidsPlaces(state)
  })

  it('updates intermediate bids places on new bid', () => {
    const bidsState = generateMockBidsState(3)
    const change = newBidChanged(4, mockBidsAddresses[3], parseEther('2.5'))
    const state = bidsReducer(bidsState, change)

    verifyBid(state, change, 2)
    verifyBidsPlaces(state)
  })

  describe("when new bid's amount is less than existing one", () => {
    it('does not change state', () => {
      const bidsState = generateMockBidsState(1)
      const change = newBidChanged(1, mockBidsAddresses[0], parseEther('0.5'))
      const state = bidsReducer(bidsState, change)

      const bids = bidsState.get('bids')
      verifyBid(state, bids.get(0)!.toObject(), 1)
    })
  })
})

function newBidChanged(bidderID: number, bidderAddress: string, amount: BigNumberish): BidChanged {
  return {
    bidderID: BigNumber.from(bidderID),
    bidderAddress: bidderAddress,
    amount: BigNumber.from(amount),
  }
}

function verifyBid(bidsState: ImmutableBidsState, change: BidChanged, place: number) {
  const bidIndex = place - 1
  const bids = bidsState.get('bids')
  const bid = bids.get(bidIndex)
  expect(bid).not.toBe(undefined)
  expect(bid!.toObject()).toStrictEqual({
    ...change,
    place: place,
  })

  const bidders = bidsState.get('bidders')
  const index = bidders.get(change.bidderAddress)
  expect(index).toBe(bidIndex)
}

function verifyBidsPlaces(state: ImmutableBidsState) {
  const bidders = state.get('bidders')
  const bids = state.get('bids')

  let previousAmount = MaxUint256
  for (let i = 0; i < bids.size; i++) {
    const bid = bids.get(i)!.toObject()
    expect(bid.place).toBe(i + 1)
    expect(previousAmount.gte(bid.amount)).toBeTruthy()
    previousAmount = bid.amount

    const bidIndex = bidders.get(bid.bidderAddress)
    expect(bidIndex).toBe(i)
  }
}
