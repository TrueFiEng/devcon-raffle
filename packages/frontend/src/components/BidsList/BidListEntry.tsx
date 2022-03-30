import { EmptyBid } from 'src/constants/emptyBids'
import { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import { getArbiscanAddressLink } from 'src/utils/getArbiscanLink'
import styled, { css } from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from './BidsColumns'

interface Props {
  bid?: BidWithPlace
  emptyBid?: EmptyBid
  isUser?: boolean
  view?: 'short' | 'full'
}

export const BidListEntry = ({ bid, emptyBid, isUser, view = 'full' }: Props) => {
  return (
    <BidsEntryRow isUser={isUser}>
      <PlaceColumn>{bid ? bid.place : emptyBid?.place}.</PlaceColumn>
      <BidColumn>{bid ? formatEtherAmount(bid.amount) + ' ETH' : emptyBid?.amount} </BidColumn>
      <AddressColumn>
        {bid ? (
          <AddressLink href={getArbiscanAddressLink(bid.bidderAddress)} target="_blank" rel="noopener noreferrer">
            {view === 'short' ? shortenEthAddress(bid.bidderAddress) : bid.bidderAddress}
          </AddressLink>
        ) : (
          emptyBid?.bidderAddress
        )}
      </AddressColumn>
    </BidsEntryRow>
  )
}

const BidsEntryRow = styled.div<{ isUser?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-areas: 'place bid address';
  position: relative;

  ${({ isUser }) =>
    isUser &&
    css`
      &::before {
        content: '';
        width: calc(100% + 48px);
        height: calc(100% + 20px);
        border-width: 2px;
        border-style: solid;
        border-image: linear-gradient(90deg, rgba(126, 193, 136, 1), rgba(101, 196, 232, 1), rgba(119, 121, 181, 1)) 1;
        position: absolute;
        top: -10px;
        left: -24px;
        z-index: 1;
      }
    `};
`

const AddressLink = styled.a`
  font-family: 'Space Mono', 'Roboto Mono', monospace;
  font-style: normal;
  color: ${Colors.Blue};
  text-decoration: none;
`
