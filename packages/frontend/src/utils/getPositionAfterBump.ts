import { BigNumber } from '@ethersproject/bignumber'
import { BidWithPlace } from 'src/models/Bid'

export const getPositionAfterBump = (newAmount: BigNumber, bidderID: BigNumber, bids: BidWithPlace[]) =>
  bids.findIndex((bid) => {
    if (bid.amount.eq(newAmount)) {
      return bid.bidderID.gt(bidderID)
    }
    return bid.amount.lt(newAmount)
  }) + 1 || bids.length + 1
