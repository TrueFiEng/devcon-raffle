import { Log } from '@ethersproject/providers'
import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks/pure'
import { useBidEvents } from 'src/providers/Bids/useBidEvents'
import { createMockBidLog } from 'test/mocks/createMockBidLog'

let mockBlockNumber = 10
let mockLogs: Log[] = []

jest.mock('@ethersproject/providers', () => ({
  ...jest.requireActual('@ethersproject/providers'),
  JsonRpcProvider: class {
    constructor() {
      undefined
    }
    getBlock = () => ({ number: mockBlockNumber })
    getLogs = () => mockLogs
  },
}))
jest.useFakeTimers()

describe('useBidEvents', () => {
  const render = () => renderHook(() => useBidEvents())

  it('Fetches logs', async () => {
    const mockLog = createMockBidLog(1, '0x2546bcd3c84621e976d8185a91a922ae77ecec30', 1, '1.5')
    mockLogs = [mockLog]
    const { result } = render()

    await waitFor(() => {
      expect(result.current).toEqual([mockLog])
    })
  })

  it.skip('Appends new entries', async () => {
    const initialLog = createMockBidLog(1, '0x2546bcd3c84621e976d8185a91a922ae77ecec30', 2, '1.5')
    mockLogs = [initialLog]
    const { result, rerender } = render()

    await waitFor(() => {
      expect(result.current).toEqual([initialLog])
    })

    jest.runAllTimers()
    const appendedLog = createMockBidLog(15, '0xbda5747bfd65f08deb54cb465eb87d40e51b197e', 3, '2.5')
    mockLogs = [appendedLog]
    mockBlockNumber = 20
    jest.runAllTimers()
    rerender()

    await waitFor(
      () => {
        expect(result.current).toEqual([initialLog, appendedLog])
      },
      { timeout: 2000 }
    )
  })
})
