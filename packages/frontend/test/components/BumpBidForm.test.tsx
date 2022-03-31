import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { render, screen } from '@testing-library/react'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { generateMockBids } from 'test/mocks/generateMockBids'

const mockBalance = parseEther('100')

jest.mock('@usedapp/core', () => ({
  useEthers: () => ({
    account: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  }),
  useEtherBalance: () => mockBalance,
}))

describe('UI: BumpBidForm', () => {
  const mockBids = generateMockBids(5)

  it('Displays current place and place after bump', () => {
    renderComponent(parseEther('4.5'), parseEther('1'))
    const places = screen.queryAllByText(/No\. [0-9]/)
    expect(places[0]).toHaveTextContent('No. 5')
    expect(places[1]).toHaveTextContent('No. 2')
  })

  const renderComponent = (newAmount: BigNumber, bumpAmount: BigNumber) =>
    render(
      <BumpBidForm
        userBid={mockBids[4]}
        newBid={newAmount}
        bumpAmount={bumpAmount}
        setBumpAmount={() => undefined}
        setView={() => undefined}
        bids={mockBids}
      />
    )
})
