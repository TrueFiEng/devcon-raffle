import { BigNumber } from 'ethers'

export interface Bid {
  bidderID: BigNumber,
  amount: BigNumber,
  isAuctionWinner: boolean,
  claimed: boolean,
  raffleParticipantIndex: BigNumber,
}
