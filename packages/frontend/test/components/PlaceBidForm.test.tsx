import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { PlaceBidForm } from 'src/components/Bid/PlaceBid/PlaceBidForm'
import { mockBids } from 'test/mocks/mockUseBids'

let mockBalance: BigNumber

jest.mock('@usedapp/core', () => ({
  useEthers: () => ({
    account: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  }),
  useEtherBalance: () => mockBalance,
}))

describe('UI: PlaceBidForm', () => {
  beforeEach(() => {
    mockBalance = parseEther('100')
  })

  describe('Displays estimated place after bid', () => {
    it('When outbidding everyone', async () => {
      renderComponent(parseEther('10'))
      expect(await screen.findByText('No. 1')).toBeDefined()
    })

    it('When placing in the midle of the list', async () => {
      renderComponent(parseEther('1.5'))
      expect(await screen.findByText('No. 2')).toBeDefined()
    })

    it("When meeting other user's bid", async () => {
      renderComponent(parseEther('1.0'))
      expect(await screen.findByText('No. 3')).toBeDefined()
    })

    it('When placing last', async () => {
      renderComponent(parseEther('0.2'))
      expect(await screen.findByText('No. 5')).toBeDefined()
    })
  })

  describe('Input validation', () => {
    it('Trying to place a bid below minimum', async () => {
      renderComponent(parseEther('0.001'))
      expect(await screen.findByText('Bid amount must be at least Raffle price')).toBeDefined()
    })

    it('Trying to place a bid exceeding balance', async () => {
      renderComponent(parseEther('200'))
      expect(await screen.findByText('Not enough balance')).toBeDefined()
    })
  })

  const renderComponent = (bid: BigNumber) =>
    render(
      <PlaceBidForm
        bid={bid}
        setBid={() => undefined}
        minimumBid={parseEther('0.15')}
        bids={mockBids}
        setView={() => undefined}
      />
    )
})
