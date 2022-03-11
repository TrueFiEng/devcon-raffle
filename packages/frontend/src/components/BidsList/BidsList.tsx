import React from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { BidsColumns } from './BidsColumns'
import { BidsListEntry } from './BidsListEntry'

export const BidsListSection = () => {
  return (
    <BidsListContainer>
      <h2>
        Number of participants: <ColoredNumber>100</ColoredNumber>
      </h2>
      <BidsHeaders>
        <PlaceColumn>Place</PlaceColumn>
        <BidColumn>Bid</BidColumn>
        <AddressColumn>Address</AddressColumn>
      </BidsHeaders>
      <BidsList>
        <BidsListEntry />
        <BidsListEntry />
        <BidsListEntry />
      </BidsList>
    </BidsListContainer>
  )
}

const BidsListContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 46px;
  padding-right: 60px;
  display: flex;
  flex-direction: column;
  justify-content: left;
`

const ColoredNumber = styled.span`
  color: ${Colors.Cobalt};
`

const BidsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 32px 0;
`

const BidsHeaders = styled.div`
  ${BidsColumns}
  padding-top: 50px;
`

export const PlaceColumn = styled.span`
  grid-area: place;
`

export const BidColumn = styled.span`
  grid-area: bid;
`

export const AddressColumn = styled.span`
  grid-area: address;
`
