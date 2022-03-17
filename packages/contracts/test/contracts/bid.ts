import { BigNumber } from 'ethers'

export type Bid = {
  bidderID: BigNumber,
  amount: BigNumber,
  winType: number,
  claimed: boolean,
}
