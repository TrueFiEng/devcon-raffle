import { BigNumber } from '@ethersproject/bignumber'

export interface Bid {
  bidderAddress: string
  amount: BigNumber
}
