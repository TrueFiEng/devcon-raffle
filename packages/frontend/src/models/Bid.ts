import { BigNumber } from '@ethersproject/bignumber'
import { WinOptions } from 'src/components/Claim/WinBid/WinFlowEnum'

export interface Bid {
  bidderID: BigNumber
  bidderAddress: string
  amount: BigNumber
}

export interface BidWithPlace extends Bid {
  place: number
}

export interface SettledBid extends Bid {
  winType: WinOptions
  claimed: boolean
}
