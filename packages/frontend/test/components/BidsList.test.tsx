/* eslint-disable jest/expect-expect */
// Some tests run assertions in external functions

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BidsListSection } from 'src/components/BidsList/BidsListSection'
import { BidWithPlace } from 'src/models/Bid'
import { BidsContext } from 'src/providers/Bids'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import { generateMockBids } from 'test/mocks/generateMockBids'

const mockUserAddress = '0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'

jest.mock('@usedapp/core', () => ({
  useEthers: () => ({ account: mockUserAddress }),
  addressEqual: jest.requireActual('@usedapp/core').addressEqual,
}))

jest.mock('src/hooks/useAuctionParticipants', () => ({
  useAuctionParticipants: () => 10,
}))

describe('UI: BidsListSection', () => {
  it('With less than four bids', () => {
    const bids = generateMockBids(3)
    renderComponent(bids)
    bids.forEach(testDisplayedBid)
  })

  it('With four bids', () => {
    const bids = generateMockBids(4)
    renderComponent(bids)
    bids.forEach(testDisplayedBid)
  })

  it('With more than four bids, less bids than auction tickets', () => {
    const bids = generateMockBids(7)
    renderComponent(bids)
    bids.slice(0, 3).forEach(testDisplayedBid)
    bids.slice(3, 6).forEach(testHiddenBid)
    testDisplayedBid(bids[6])
  })

  it('With more bids than auction tickets', () => {
    const bids = generateMockBids(15)
    renderComponent(bids)
    bids.slice(0, 3).forEach(testDisplayedBid)
    testHiddenBid(bids.find(({ place }) => place === 4)!)
    testHiddenBid(bids.find(({ place }) => place === 15)!)
    testDisplayedBid(bids[9])
  })

  describe('Always displays user bid', () => {
    it('Within the top three bids', () => {
      const bids = generateMockBids(15)
      bids[1].bidderAddress = mockUserAddress
      renderComponent(bids)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
    })

    it('Within auction bids', () => {
      const bids = generateMockBids(15)
      bids[8].bidderAddress = mockUserAddress
      renderComponent(bids)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
    })

    it('Within raffle bids', () => {
      const bids = generateMockBids(15)
      bids[13].bidderAddress = mockUserAddress
      renderComponent(bids)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
    })

    it('User bid is the third (last of the top bids)', () => {
      const bids = generateMockBids(15)
      bids[2].bidderAddress = mockUserAddress
      renderComponent(bids)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
      expect(screen.queryAllByText(shortenEthAddress(mockUserAddress))).toHaveLength(1)
    })

    it('User bid is the bottom auction bid', () => {
      const bids = generateMockBids(15)
      bids[9].bidderAddress = mockUserAddress
      renderComponent(bids)
      expect(screen.getByText(shortenEthAddress(mockUserAddress))).toBeDefined()
      expect(screen.queryAllByText(shortenEthAddress(mockUserAddress))).toHaveLength(1)
    })
  })

  const testDisplayedBid = (bid: BidWithPlace) => {
    const place = screen.getByText(bid.place + '.')
    // eslint-disable-next-line testing-library/no-node-access
    expect(place.parentElement).toHaveTextContent(
      `${bid.place}.${formatEtherAmount(bid.amount)} ETH ${shortenEthAddress(bid.bidderAddress)}`
    )
  }
  const testHiddenBid = (bid: BidWithPlace) => {
    expect(screen.queryAllByText(bid.place + '.')).toHaveLength(0)
    expect(screen.queryAllByText(`${formatEtherAmount(bid.amount)} ETH`)).toHaveLength(0)
    expect(screen.queryAllByText(shortenEthAddress(bid.bidderAddress))).toHaveLength(0)
  }

  const renderComponent = (bids: BidWithPlace[]) =>
    render(
      <BidsContext.Provider value={{ bids }}>
        <MemoryRouter>
          <BidsListSection />
        </MemoryRouter>
      </BidsContext.Provider>
    )
})
