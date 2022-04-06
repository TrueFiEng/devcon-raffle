import { BigNumber } from '@ethersproject/bignumber'

export interface Bid {
  bidderID: BigNumber
  bidderAddress: string
  amount: BigNumber
}

export interface BidWithPlace extends Bid {
  place: number
}
