import { Log } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useBids } from 'src/hooks/useBids'
import { BidsProvider } from 'src/providers/Bids'
import { createMockBidLog } from 'test/_utils/createMockBidLog'

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
    mockEvents = [createMockBidLog(1, address, '1.5')]
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
    mockEvents = [createMockBidLog(1, address, '1.5'), createMockBidLog(5, address, '2.4')]
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
})
