import { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import { getArbiscanAddressLink } from 'src/utils/getArbiscanLink'
import styled from 'styled-components'

import { AddressColumn, BidColumn, BidsColumns, PlaceColumn } from './BidsColumns'

interface Props {
  bid: BidWithPlace
  isUser?: boolean
}

export const BidsListEntry = ({ bid, isUser }: Props) => {
  return (
    <BidsEntry>
      <BidsEntryRow isUser={isUser}>
        <PlaceColumn>{bid.place}.</PlaceColumn>
        <BidColumn>{formatEtherAmount(bid.amount)} ETH</BidColumn>
        <AddressColumn>
          <AddressLink href={getArbiscanAddressLink(bid.bidderAddress)} target="_blank" rel="noopener noreferrer">
            {shortenEthAddress(bid.bidderAddress)}
          </AddressLink>
        </AddressColumn>
      </BidsEntryRow>
    </BidsEntry>
  )
}

const BidsEntry = styled.li`
  &:not(:last-child) {
    margin-bottom: 32px;
  }
`
const BidsEntryRow = styled.div<{ isUser?: boolean }>`
  ${BidsColumns};
  border: ${({ isUser }) => (isUser ? `2px solid ${Colors.Green}` : 'none')};
`

const AddressLink = styled.a`
  color: ${Colors.Blue};
`
