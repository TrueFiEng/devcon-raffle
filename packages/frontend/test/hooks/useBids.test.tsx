import { Log } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { renderHook } from '@testing-library/react-hooks'
import { useBids } from 'src/hooks/useBids'
import { BidsProvider } from 'src/providers/Bids'
import { createMockBidLog } from 'test/mocks/createMockBidLog'

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
    const address = '0xBcd4042DE499D14e55001CcbB24a551F3b954096'
    mockEvents = [createMockBidLog(1, address, 1, '1.5')]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderAddress: address,
          amount: parseEther('1.5'),
          place: 1,
        },
      ],
    })
  })

  it('Picks the bumped bid', () => {
    const address = '0xBcd4042DE499D14e55001CcbB24a551F3b954096'
    mockEvents = [createMockBidLog(1, address, 2, '1.5'), createMockBidLog(5, address, 3, '2.4')]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderAddress: address,
          amount: parseEther('2.4'),
          place: 1,
        },
      ],
    })
  })

  it('Sorts bids by amount, highest to lowest', () => {
    mockEvents = [
      createMockBidLog(5, '0xcd3B766CCDd6AE721141F452C550Ca635964ce71', 1, '1.0'),
      createMockBidLog(5, '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', 2, '4.0'),
      createMockBidLog(5, '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', 3, '1.5'),
    ]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
          amount: parseEther('4.0'),
          place: 1,
        },
        {
          bidderAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
          amount: parseEther('1.5'),
          place: 2,
        },
        {
          bidderAddress: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
          amount: parseEther('1.0'),
          place: 3,
        },
      ],
    })
  })

  it('Sorts same-amount bids oldest to newest', () => {
    mockEvents = [
      createMockBidLog(5, '0xcd3B766CCDd6AE721141F452C550Ca635964ce71', 2, '1.0'),
      createMockBidLog(5, '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', 1, '1.0'),
      createMockBidLog(5, '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', 3, '1.0'),
    ]
    const { result } = render()
    expect(result.current).toEqual({
      bids: [
        {
          bidderAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
          amount: parseEther('1.0'),
          place: 1,
        },
        {
          bidderAddress: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
          amount: parseEther('1.0'),
          place: 2,
        },
        {
          bidderAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
          amount: parseEther('1.0'),
          place: 3,
        },
      ],
    })
  })
})
