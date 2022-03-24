import type { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { blockExplorerBase } from 'src/utils/blockExplorerBase'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import styled from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from '../BidsList/BidsColumns'

import { AllBidsColumns } from './AllBidsColumns'

interface Props {
  bids: BidWithPlace[]
}

export const BidsSubList = ({ bids }: Props) => (
  <BidsList>
    {bids.map(({ bidderAddress, amount, place }) => (
      <li key={bidderAddress}>
        <BidsEntryRow>
          <PlaceColumn>{place}</PlaceColumn>
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
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
`

const BidsEntryRow = styled.div`
  ${AllBidsColumns};
`

const AddressLink = styled.a`
  color: ${Colors.BlueDark};
`
