import { BigNumber } from 'ethers'
import { biggerFirst } from 'utils/bigNumber'

interface Bid {
  bidderID: number,
  amount: BigNumber,
}

export function compareBids(a: Bid, b: Bid) {
  const amountCmp = biggerFirst(a.amount, b.amount)
  if (amountCmp !== 0) {
    return amountCmp
  }
  return -biggerFirst(BigNumber.from(a.bidderID), BigNumber.from(b.bidderID))
}
