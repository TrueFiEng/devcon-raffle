import { parseEther } from '@ethersproject/units'
import { getPositionAfterBid } from 'src/utils'
import { generateMockBids } from 'test/mocks/generateMockBids'

describe('getPositionAfterBid', () => {
  const bids = generateMockBids(4)

  it('When outbidding everyone', () => {
    expect(getPositionAfterBid(parseEther('10'), bids)).toBe(1)
  })

  it('When placing in the middle of the list', () => {
    expect(getPositionAfterBid(parseEther('2.5'), bids)).toBe(3)
  })

  it("When meeting other user's bid", () => {
    expect(getPositionAfterBid(parseEther('2.0'), bids)).toBe(4)
  })

  it('When placing last', () => {
    expect(getPositionAfterBid(parseEther('0.2'), bids)).toBe(5)
  })
})
