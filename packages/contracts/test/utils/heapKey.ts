import { BigNumber, BigNumberish } from 'ethers'

export function heapKey(bidderID: BigNumberish, amount: BigNumberish) {
  const bidderMask = BigNumber.from('0xffffffff')
  return BigNumber.from(amount).shl(32).or(bidderMask.sub(bidderID))
}
