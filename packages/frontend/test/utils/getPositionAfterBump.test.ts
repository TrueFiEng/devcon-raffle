import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { getPositionAfterBump } from 'src/utils/getPositionAfterBump'
import { generateMockBids, mockBidsAddresses } from 'test/mocks/generateMockBids'

import { BidWithPlace } from '../../src/models/Bid'

describe('getPositionAfterBump', () => {
  const bids = generateMockBids(4)
  let newBid: BidWithPlace

  beforeEach(() => {
    newBid = {
      bidderID: BigNumber.from(10),
      bidderAddress: mockBidsAddresses[10],
      place: 10,
      amount: parseEther('10'),
    }
  })

  it('When outbidding everyone', () => {
    expect(getPositionAfterBump(newBid, bids)).toBe(1)
  })

  it('When placing in the middle of the list', () => {
    newBid.bidderID = BigNumber.from(2)
    newBid.amount = parseEther('2.5')
    expect(getPositionAfterBump(newBid, bids)).toBe(3)
  })

  it("When meeting other user's bid whose bidderID is lower", () => {
    newBid.bidderID = BigNumber.from(2)
    newBid.amount = parseEther('2')
    expect(getPositionAfterBump(newBid, bids)).toBe(3)
  })

  it("When meeting other user's bid whose bidderID is higher", () => {
    newBid.bidderID = BigNumber.from(5)
    newBid.amount = parseEther('2')
    expect(getPositionAfterBump(newBid, bids)).toBe(4)
  })

  it('When placing last', () => {
    newBid.amount = parseEther('0.5')
    expect(getPositionAfterBump(newBid, bids)).toBe(5)
  })
})
