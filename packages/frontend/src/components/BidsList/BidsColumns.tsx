import styled, { css } from 'styled-components'

export const BidsColumns = css`
  display: grid;
  grid-template-columns: auto 48% 26%;
  grid-template-areas: 'place bid address';
`

export const PlaceColumn = styled.span`
  grid-area: place;
`

export const BidColumn = styled.span`
  grid-area: bid;
`

export const AddressColumn = styled.span`
  grid-area: address;
  text-align: right;
`
