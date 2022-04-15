import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { renderHook } from '@testing-library/react-hooks'
import { useBids } from 'src/hooks/useBids'
import { Bid } from 'src/models/Bid'
import { BidsProvider } from 'src/providers/Bids'
import { mockBidsAddresses } from 'test/mocks/generateMockBids'

let mockBids: Bid[] = []

jest.mock('src/hooks/useContractBids', () => ({
  useContractBids: () => mockBids,
}))

describe('useBids', () => {
  const render = () => {
    return renderHook(() => useBids(), {
      wrapper: ({ children }) => <BidsProvider>{children}</BidsProvider>,
    })
  }

  it('Sets correct place', () => {
    mockBids = [createBid(1, '1.5')]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderID: BigNumber.from(1),
          bidderAddress: mockBidsAddresses[0],
          amount: parseEther('1.5'),
          place: 1,
        },
      ],
    })
  })

  it('Sorts bids by amount, highest to lowest', () => {
    mockBids = [createBid(1, '1.0'), createBid(2, '4.0'), createBid(3, '1.5')]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderID: BigNumber.from(2),
          bidderAddress: mockBidsAddresses[1],
          amount: parseEther('4.0'),
          place: 1,
        },
        {
          bidderID: BigNumber.from(3),
          bidderAddress: mockBidsAddresses[2],
          amount: parseEther('1.5'),
          place: 2,
        },
        {
          bidderID: BigNumber.from(1),
          bidderAddress: mockBidsAddresses[0],
          amount: parseEther('1.0'),
          place: 3,
        },
      ],
    })
  })

  it('Sorts same-amount bids oldest to newest', () => {
    mockBids = [createBid(2, '1.0'), createBid(1, '1.0'), createBid(3, '1.0')]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderID: BigNumber.from(1),
          bidderAddress: mockBidsAddresses[0],
          amount: parseEther('1.0'),
          place: 1,
        },
        {
          bidderID: BigNumber.from(2),
          bidderAddress: mockBidsAddresses[1],
          amount: parseEther('1.0'),
          place: 2,
        },
        {
          bidderID: BigNumber.from(3),
          bidderAddress: mockBidsAddresses[2],
          amount: parseEther('1.0'),
          place: 3,
        },
      ],
    })
  })

  it('Sorts bids by amount, highest to lowest, then by bidder ID, oldest to newest', () => {
    mockBids = [createBid(3, '2.0'), createBid(1, '1.0'), createBid(2, '2.0'), createBid(4, '3.0')]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderID: BigNumber.from(4),
          bidderAddress: mockBidsAddresses[3],
          amount: parseEther('3.0'),
          place: 1,
        },
        {
          bidderID: BigNumber.from(2),
          bidderAddress: mockBidsAddresses[1],
          amount: parseEther('2.0'),
          place: 2,
        },
        {
          bidderID: BigNumber.from(3),
          bidderAddress: mockBidsAddresses[2],
          amount: parseEther('2.0'),
          place: 3,
        },
        {
          bidderID: BigNumber.from(1),
          bidderAddress: mockBidsAddresses[0],
          amount: parseEther('1.0'),
          place: 4,
        },
      ],
    })
  })

  function createBid(bidderID: number, amount: string): Bid {
    return {
      bidderID: BigNumber.from(bidderID),
      amount: parseEther(amount),
      bidderAddress: mockBidsAddresses[bidderID - 1],
      place: -1,
    }
  }
})
