import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { render, screen } from '@testing-library/react'
import { BumpBidForm } from 'src/components/Bid/BumpBid/BumpBidForm'
import { generateMockBidsState } from 'test/mocks/generateMockBids'

const mockBalance = parseEther('100')

jest.mock('@usedapp/core', () => ({
  ...jest.requireActual('@usedapp/core'),
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

describe('UI: BumpBidForm', () => {
  const mockBids = generateMockBidsState(5).get('bids')

  it('Displays current place and place after bump', () => {
    renderComponent(parseEther('4.5'), parseEther('1'))
    const places = screen.queryAllByText(/No\. [0-9]/)
    expect(places[0]).toHaveTextContent('No. 5')
    expect(places[1]).toHaveTextContent('No. 2')
  })

  const renderComponent = (newAmount: BigNumber, minimumIncrement: BigNumber) =>
    render(
      <BumpBidForm
        userBid={mockBids.get(4)!.toObject()}
        newBidAmount={newAmount}
        bumpAmount={minimumIncrement.toString()}
        parsedBumpAmount={minimumIncrement}
        minimumIncrement={minimumIncrement}
        setBumpAmount={() => undefined}
        setView={() => undefined}
        bids={mockBids}
      />
    )
})
