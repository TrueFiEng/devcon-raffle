import { BigNumber } from '@ethersproject/bignumber'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'

export interface Bid {
  bidderID: BigNumber
  bidderAddress: string
  amount: BigNumber
  place: number
}

export interface SettledBid extends Bid {
  winType: WinType
  claimed: boolean
}
