import React from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  return (
    <BidsListContainer>
      <ListHeader>
        <h3>Number of participants:</h3>
        <ColoredNumber>100</ColoredNumber>
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
        <Button view="secondary" onClick={() => navigate('/bids')}>
          Show all
        </Button>
      </ButtonRow>
    </BidsListContainer>
  )
}

const BidsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 46px 0;
`

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
`
const ColoredNumber = styled.h3`
  color: ${Colors.Blue};
`

const BidsHeaders = styled.div`
  ${BidsColumns};
  padding-top: 50px;
  font-weight: 600;
  color: ${Colors.Black};
`
const BidsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 32px 0;
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
`
