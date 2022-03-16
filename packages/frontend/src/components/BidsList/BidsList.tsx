import React from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { Bid } from '../../models/Bid'
import { Button } from '../Buttons/Button'

import { AddressColumn, BidColumn, BidsColumns, PlaceColumn } from './BidsColumns'
import { BidsListEntry } from './BidsListEntry'

interface Props {
  bids: Bid[]
}

export const BidsListSection = ({ bids }: Props) => {
  return (
    <BidsListContainer>
      <ListHeader>
        Number of participants: <ColoredNumber>100</ColoredNumber>
      </ListHeader>
      <BidsHeaders>
        <PlaceColumn>Place</PlaceColumn>
        <BidColumn>Bid</BidColumn>
        <AddressColumn>Address</AddressColumn>
      </BidsHeaders>
      <BidsList>
        {bids.map((bid, index) => (
          <BidsListEntry key={bid.bidderAddress} place={index + 1} bid={bid.amount} address={bid.bidderAddress} />
        ))}
      </BidsList>
      <ButtonRow>
        <Button view="secondary">Show all</Button>
      </ButtonRow>
    </BidsListContainer>
  )
}

const BidsListContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 46px;
  padding-right: 144px;
  padding-bottom: 68px;
  display: flex;
  flex-direction: column;
  justify-content: left;
`

const ColoredNumber = styled.span`
  color: ${Colors.Blue};
`

const BidsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 32px 0;
`

const BidsHeaders = styled.div`
  ${BidsColumns};
  padding-top: 50px;
  font-weight: 600;
  color: ${Colors.Black};
`

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`

const ListHeader = styled.h2`
  font-weight: 600;
  letter-spacing: -2px;
  color: ${Colors.Black};
`