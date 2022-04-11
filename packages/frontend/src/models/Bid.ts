import { BigNumber } from '@ethersproject/bignumber'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'

export interface Bid {
  bidderID: BigNumber
  bidderAddress: string
  amount: BigNumber
}

export interface BidWithPlace extends Bid {
  place: number
}

export interface SettledBid extends BidWithPlace {
  winType: WinType
  claimed: boolean
}
