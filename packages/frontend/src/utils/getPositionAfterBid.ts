import { BigNumber } from '@ethersproject/bignumber'
import { ImmutableBids } from 'src/providers/Bids/types'

export const getPositionAfterBid = (newAmount: BigNumber, bids: ImmutableBids) =>
  bids.findIndex((bid) => bid.get('amount').lt(newAmount)) + 1 || bids.size + 1
