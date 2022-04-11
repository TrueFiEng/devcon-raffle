import { BigNumber } from '@ethersproject/bignumber'
import { Log } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { renderHook } from '@testing-library/react-hooks'
import { useBids } from 'src/hooks/useBids'
import { BidsProvider } from 'src/providers/Bids'
import { createMockBidLog } from 'test/mocks/createMockBidLog'
import { mockBidsAddresses } from 'test/mocks/generateMockBids'

let mockEvents: Log[] = []

jest.mock('src/providers/Bids/useBidEvents', () => ({
  useBidEvents: () => mockEvents,
}))

describe('useBids', () => {
  const render = () => {
    return renderHook(() => useBids(), {
      wrapper: ({ children }) => <BidsProvider>{children}</BidsProvider>,
    })
  }

  it('Translates logs to Bids', () => {
    const address = mockBidsAddresses[0]
    mockEvents = [createMockBidLog(1, address, 1, '1.5')]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderID: BigNumber.from(1),
          bidderAddress: address,
          amount: parseEther('1.5'),
          place: 1,
        },
      ],
    })
  })

  it('Picks the bumped bid', () => {
    const address = mockBidsAddresses[0]
    mockEvents = [createMockBidLog(1, address, 2, '1.5'), createMockBidLog(5, address, 2, '2.4')]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderID: BigNumber.from(2),
          bidderAddress: address,
          amount: parseEther('2.4'),
          place: 1,
        },
      ],
    })
  })

  it('Sorts bids by amount, highest to lowest', () => {
    mockEvents = [
      createMockBidLog(5, mockBidsAddresses[0], 1, '1.0'),
      createMockBidLog(5, mockBidsAddresses[1], 2, '4.0'),
      createMockBidLog(5, mockBidsAddresses[2], 3, '1.5'),
    ]
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
    mockEvents = [
      createMockBidLog(5, mockBidsAddresses[0], 2, '1.0'),
      createMockBidLog(5, mockBidsAddresses[1], 1, '1.0'),
      createMockBidLog(5, mockBidsAddresses[2], 3, '1.0'),
    ]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderID: BigNumber.from(1),
          bidderAddress: mockBidsAddresses[1],
          amount: parseEther('1.0'),
          place: 1,
        },
        {
          bidderID: BigNumber.from(2),
          bidderAddress: mockBidsAddresses[0],
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
    mockEvents = [
      createMockBidLog(5, mockBidsAddresses[0], 3, '2.0'),
      createMockBidLog(5, mockBidsAddresses[1], 1, '1.0'),
      createMockBidLog(5, mockBidsAddresses[2], 2, '2.0'),
      createMockBidLog(5, mockBidsAddresses[3], 4, '3.0'),
    ]
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
          bidderAddress: mockBidsAddresses[2],
          amount: parseEther('2.0'),
          place: 2,
        },
        {
          bidderID: BigNumber.from(3),
          bidderAddress: mockBidsAddresses[0],
          amount: parseEther('2.0'),
          place: 3,
        },
        {
          bidderID: BigNumber.from(1),
          bidderAddress: mockBidsAddresses[1],
          amount: parseEther('1.0'),
          place: 4,
        },
      ],
    })
  })
})
