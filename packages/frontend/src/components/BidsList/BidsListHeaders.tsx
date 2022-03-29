import { AddressColumn, BidColumn, BidsColumns, PlaceColumn } from './BidsColumns'

export const BidsListHeaders = () => {
  return (
    <BidsColumns>
      <PlaceColumn>Place</PlaceColumn>
      <BidColumn>Bid</BidColumn>
      <AddressColumn>Address</AddressColumn>
    </BidsColumns>
  )
}
