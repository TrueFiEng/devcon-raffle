import { Bid } from 'src/models/Bid'

export const getPositionAfterBump = (newBid: Bid, bids: Bid[]) =>
  bids.findIndex((bid) => {
    if (bid.amount.eq(newBid.amount)) {
      return bid.bidderID.gt(newBid.bidderID)
    }
    return bid.amount.lt(newBid.amount)
  }) + 1 || bids.length + 1
