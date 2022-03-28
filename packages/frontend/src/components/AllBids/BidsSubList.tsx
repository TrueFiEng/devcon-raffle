import { AllBidsColumns } from 'src/components/AllBids/AllBidsColumns'
import { AddressColumn, BidColumn, PlaceColumn } from 'src/components/BidsList/BidsColumns'
import type { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { getArbiscanAddressLink } from 'src/utils/getArbiscanLink'
import styled from 'styled-components'

interface Props {
  bids: BidWithPlace[]
}

export const BidsSubList = ({ bids }: Props) => {
  return (
    <BidsList>
      {bids.map(({ bidderAddress, amount, place }) => (
        <li key={bidderAddress}>
          <BidsEntryRow>
            <PlaceColumn>{place}.</PlaceColumn>
            <BidColumn>{formatEtherAmount(amount)} ETH</BidColumn>
            <AddressColumn>
              <AddressLink target="_blank" href={getArbiscanAddressLink(bidderAddress)} rel="noopener noreferrer">
                {bidderAddress}
              </AddressLink>
            </AddressColumn>
          </BidsEntryRow>
        </li>
      ))}
    </BidsList>
  )
}

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
  color: ${Colors.Blue};
  text-decoration: none;
`
