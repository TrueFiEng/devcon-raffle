import { Bid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { blockExplorerBase } from 'src/utils/blockExplorerBase'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import styled from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from '../BidsList/BidsColumns'

import { AllBidsColumns } from './AllBidsColumns'

interface Props {
  bids: Bid[]
}

export const BidsSubList = ({ bids }: Props) => (
  <BidsList>
    {bids.map(({ bidderAddress, amount }, index) => (
      <li key={bidderAddress}>
        <BidsEntryRow>
          <PlaceColumn>{index}</PlaceColumn>
          <BidColumn>{formatEtherAmount(amount)} ETH</BidColumn>
          <AddressColumn>
            <AddressLink target="_blank" href={blockExplorerBase + bidderAddress} rel="noopener noreferrer">
              {bidderAddress}
            </AddressLink>
          </AddressColumn>
        </BidsEntryRow>
      </li>
    ))}
  </BidsList>
)

const BidsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const BidsEntryRow = styled.div`
  ${AllBidsColumns};
  padding: 20px 0;
`

const AddressLink = styled.a`
  color: ${Colors.BlueDark};
`
