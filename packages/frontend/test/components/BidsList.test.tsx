/* eslint-disable jest/expect-expect */
// Some tests run assertions in external functions

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BidsListSection } from 'src/components/BidsList/BidsListSection'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'
import { UserBid } from 'src/models/Bid'
import { BidsContext } from 'src/providers/Bids/context'
import { ImmutableBid, ImmutableBidsState } from 'src/providers/Bids/types'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import { generateMockBidsState, setBidAddress } from 'test/mocks/generateMockBids'

const mockUserAddress = '0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
const arbitrumRinkebyChainId = 421611
let mockUserBid: UserBid | undefined

jest.mock('@usedapp/core', () => ({
  ...jest.requireActual('@usedapp/core'),
  useEthers: () => ({ account: mockUserAddress }),
  addressEqual: jest.requireActual('@usedapp/core').addressEqual,
}))

jest.mock('src/hooks/useAuctionWinnersCount', () => ({
  useAuctionWinnersCount: () => 10,
}))

jest.mock('src/hooks/useUserBid', () => ({
  useUserBid: () => mockUserBid,
}))

jest.mock('src/hooks/chainId/useChainId', () => ({
  useChainId: () => arbitrumRinkebyChainId,
}))

jest.mock('src/hooks/useContractBids', () => ({
  useContractBids: () => [],
}))

jest.mock('src/hooks', () => ({
  useRaffleWinnersCount: () => 16,
  useBids: () => ({ bids: [] }),
}))

describe('UI: BidsListSection', () => {
  afterEach(() => {
    mockUserBid = undefined
  })

  it('With less than four bids', () => {
    const bidsState = generateMockBidsState(3)
    const bids = bidsState.get('bids')
    renderComponent(bidsState)
    bids.forEach(testDisplayedBid)
  })

  it('With four bids', () => {
    const bidsState = generateMockBidsState(4)
    const bids = bidsState.get('bids')
    renderComponent(bidsState)
    bids.forEach(testDisplayedBid)
  })

  it('With more than four bids, less bids than auction tickets', () => {
    const bidsState = generateMockBidsState(7)
    const bids = bidsState.get('bids')
    renderComponent(bidsState)
    bids.slice(0, 3).forEach(testDisplayedBid)
    bids.slice(3, 6).forEach(testHiddenBid)
    testDisplayedBid(bids.get(6)!)
  })

  it('With more bids than auction tickets', () => {
    const bidsState = generateMockBidsState(15)
    const bids = bidsState.get('bids')
    renderComponent(bidsState)
    bids.slice(0, 3).forEach(testDisplayedBid)
    testHiddenBid(bids.find((bid) => bid.get('place') === 4)!)
    testHiddenBid(bids.find((bid) => bid.get('place') === 15)!)
    testDisplayedBid(bids.get(9)!)
  })

  describe('Always displays user bid', () => {
    it('Within the top three bids', () => {
      let bidsState = generateMockBidsState(15)
      bidsState = setBidAddress(bidsState, 1, mockUserAddress)
      const bids = bidsState.get('bids')
      setMockUserBid(bids.get(1)!)
      renderComponent(bidsState)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
    })

    it('Within auction bids', () => {
      let bidsState = generateMockBidsState(15)
      bidsState = setBidAddress(bidsState, 8, mockUserAddress)
      const bids = bidsState.get('bids')
      setMockUserBid(bids.get(8)!)
      renderComponent(bidsState)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
    })

    it('Within raffle bids', () => {
      let bidsState = generateMockBidsState(15)
      bidsState = setBidAddress(bidsState, 13, mockUserAddress)
      const bids = bidsState.get('bids')
      setMockUserBid(bids.get(13)!)
      renderComponent(bidsState)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
    })

    it('User bid is the third (last of the top bids)', () => {
      let bidsState = generateMockBidsState(15)
      const bids = bidsState.get('bids')
      bidsState = setBidAddress(bidsState, 2, mockUserAddress)
      setMockUserBid(bids.get(2)!)
      renderComponent(bidsState)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
      expect(screen.queryAllByText(shortenEthAddress(mockUserAddress))).toHaveLength(1)
    })

    it('User bid is the bottom auction bid', () => {
      let bidsState = generateMockBidsState(15)
      const bids = bidsState.get('bids')
      bidsState = setBidAddress(bidsState, 9, mockUserAddress)
      setMockUserBid(bids.get(9)!)
      renderComponent(bidsState)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
      expect(screen.queryAllByText(shortenEthAddress(mockUserAddress))).toHaveLength(1)
    })
  })

  const testDisplayedBid = (bid: ImmutableBid) => {
    const place = screen.getByText(bid.get('place') + '.')
    // eslint-disable-next-line testing-library/no-node-access
    expect(place.parentElement).toHaveTextContent(
      `${bid.get('place')}.${formatEtherAmount(bid.get('amount'))} ETH ${shortenEthAddress(bid.get('bidderAddress'))}`
    )
  }
  const testHiddenBid = (bid: ImmutableBid) => {
    expect(screen.queryAllByText(bid.get('place') + '.')).toHaveLength(0)
    expect(screen.queryAllByText(`${formatEtherAmount(bid.get('amount'))} ETH`)).toHaveLength(0)
    expect(screen.queryAllByText(shortenEthAddress(bid.get('bidderAddress')))).toHaveLength(0)
  }

  const renderComponent = (bidsState: ImmutableBidsState) =>
    render(
      <BidsContext.Provider value={{ bidsState }}>
        <MemoryRouter>
          <BidsListSection />
        </MemoryRouter>
      </BidsContext.Provider>
    )
})

function setMockUserBid(bid: ImmutableBid) {
  mockUserBid = {
    ...bid.toObject(),
    winType: WinType.Loss,
    claimed: false,
  }
}
