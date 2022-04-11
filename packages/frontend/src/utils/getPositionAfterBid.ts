import { BigNumber } from '@ethersproject/bignumber'
import { BidWithPlace } from 'src/models/Bid'

export const getPositionAfterBid = (newAmount: BigNumber, bids: BidWithPlace[]) =>
  bids.findIndex((bid) => bid.amount.lt(newAmount)) + 1 || bids.length + 1
