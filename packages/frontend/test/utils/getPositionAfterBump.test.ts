import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { getPositionAfterBump } from 'src/utils/getPositionAfterBump'
import { generateMockBidsState } from 'test/mocks/generateMockBids'

describe('getPositionAfterBump', () => {
  const bids = generateMockBidsState(4).get('bids')

  it('When outbidding everyone', () => {
    expect(getPositionAfterBump(parseEther('10'), BigNumber.from(10), bids)).toBe(1)
  })

  it('When placing in the middle of the list', () => {
    expect(getPositionAfterBump(parseEther('2.5'), BigNumber.from(2), bids)).toBe(3)
  })

  it("When meeting other user's bid whose bidderID is lower", () => {
    expect(getPositionAfterBump(parseEther('2'), BigNumber.from(2), bids)).toBe(3)
  })

  it("When meeting other user's bid whose bidderID is higher", () => {
    expect(getPositionAfterBump(parseEther('2'), BigNumber.from(5), bids)).toBe(4)
  })

  it('When placing last', () => {
    expect(getPositionAfterBump(parseEther('0.5'), BigNumber.from(10), bids)).toBe(5)
  })
})
