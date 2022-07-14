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

export const NonAuctionBidsListHeaders = () => {
  return (
    <BidsColumns>
      <PlaceColumn>Bidder ID</PlaceColumn>
      <BidColumn>Bid</BidColumn>
      <AddressColumn>Address</AddressColumn>
    </BidsColumns>
  )
}
