import { BigNumber } from 'ethers'

export interface Bid {
  bidderID: BigNumber,
  amount: BigNumber,
  winType: number,
  claimed: boolean,
}
