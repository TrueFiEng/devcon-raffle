import { BigNumber } from '@ethersproject/bignumber'
import { ImmutableBids } from 'src/providers/Bids/types'

export const getPositionAfterBump = (newAmount: BigNumber, bidderID: BigNumber, bids: ImmutableBids) =>
  bids.findIndex((bid) => {
    const amount = bid.get('amount')
    if (amount.eq(newAmount)) {
      return bid.get('bidderID').gt(bidderID)
    }
    return amount.lt(newAmount)
  }) + 1 || bids.size + 1
