import { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import { getArbiscanAddressLink } from 'src/utils/getArbiscanLink'
import styled from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from './BidsColumns'

interface Props {
  bid: BidWithPlace
  isUser?: boolean
  view?: 'short' | 'full'
}

export const BidListEntry = ({ bid, isUser, view = 'full' }: Props) => {
  return (
    <BidsEntryRow isUser={isUser}>
      <PlaceColumn>{bid.place}.</PlaceColumn>
      <BidColumn>{formatEtherAmount(bid.amount)} ETH</BidColumn>
      <AddressColumn>
        <AddressLink href={getArbiscanAddressLink(bid.bidderAddress)} target="_blank" rel="noopener noreferrer">
          {view === 'short' ? shortenEthAddress(bid.bidderAddress) : bid.bidderAddress}
        </AddressLink>
      </AddressColumn>
    </BidsEntryRow>
  )
}

const BidsEntryRow = styled.div<{ isUser?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-areas: 'place bid address';
  border: ${({ isUser }) => (isUser ? `2px solid ${Colors.Green}` : 'none')};
`

const AddressLink = styled.a`
  font-family: 'Space Mono', 'Roboto Mono', monospace;
  font-style: normal;
  color: ${Colors.Blue};
  text-decoration: none;
`
