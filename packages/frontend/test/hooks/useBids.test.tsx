import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Log } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { renderHook } from '@testing-library/react-hooks'
import { EventFragment } from '@usedapp/core/node_modules/ethers/lib/utils'
import React from 'react'
import { DEVCON6_ABI } from 'src/constants/abis'
import { useBids } from 'src/hooks/useBids'
import { BidsProvider } from 'src/providers/Bids'

let mockEvents: Log[] = []

jest.mock('../../src/providers/Bids/useBidEvents', () => ({
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
    mockEvents = [makeLog(1, address, '1.5')]
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
    mockEvents = [makeLog(1, address, '1.5'), makeLog(5, address, '2.4')]
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

  function makeLog(blockNumber: number, address: string, amount: string) {
    const abi = new Interface(DEVCON6_ABI)
    return {
      blockNumber,
      blockHash: '0x',
      transactionIndex: 0,
      removed: false,
      address: '0x',
      ...abi.encodeEventLog(EventFragment.from('NewBid(address bidder, uint256 bidID, uint256 bidAmount)'), [
        address,
        BigNumber.from(0),
        parseEther(amount),
      ]),
      transactionHash: '0x',
      logIndex: 0,
    }
  }
})
