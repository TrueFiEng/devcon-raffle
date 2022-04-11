import { BigNumber } from '@ethersproject/bignumber'
import { Bid } from 'src/models/Bid'

export const getPositionAfterBid = (newAmount: BigNumber, bids: Bid[]) =>
  bids.findIndex((bid) => bid.amount.lt(newAmount)) + 1 || bids.length + 1
