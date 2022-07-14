import { parseEther } from '@ethersproject/units'
import { render, screen } from '@testing-library/react'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { generateMockBidsState } from 'test/mocks/generateMockBids'

const mockBalance = parseEther('100')

jest.mock('@usedapp/core', () => ({
  useEthers: () => ({
    account: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  }),
  useEtherBalance: () => mockBalance,
}))

jest.mock('src/hooks/useUserBid', () => ({
  useUserBid: () => undefined,
}))

jest.mock('src/hooks/useContractBids', () => ({
  useContractBids: () => [],
}))

jest.mock('src/hooks/useContractState', () => ({
  useContractState: () => ({ state: 1 }),
}))

describe('UI: PlaceBidForm', () => {
  const mockBids = generateMockBidsState(5).get('bids')

  it('Displays estimated place after bid', async () => {
    renderComponent('4.5')
    expect(await screen.findByText('No. 2')).toBeDefined()
  })

  describe('Input validation', () => {
    it('Trying to place a bid below minimum', async () => {
      renderComponent('0.001')
      expect(await screen.findByText('Bid amount must be at least Raffle price')).toBeDefined()
    })

    it('Trying to place a bid exceeding balance', async () => {
      renderComponent('200')
      expect(await screen.findByText('Not enough balance')).toBeDefined()
    })
  })

  const renderComponent = (bid: string) =>
    render(
      <PlaceBidForm
        bid={bid}
        parsedBid={parseEther(bid)}
        setBid={() => undefined}
        minimumBid={parseEther('0.15')}
        bids={mockBids}
        setView={() => undefined}
      />
    )
})
