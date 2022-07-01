import { AddressLike, NumberLike } from 'ethereum-mars'
import { constants, utils } from 'ethers'

interface DeploymentConfig {
  initialOwner: AddressLike,
  biddingStartTime: NumberLike,
  biddingEndTime: NumberLike,
  claimingEndTime: NumberLike,
  auctionWinnersCount: NumberLike,
  raffleWinnersCount: NumberLike,
  reservePrice: NumberLike,
  minBidIncrement: NumberLike,
}

export const config: DeploymentConfig = {
  initialOwner: constants.AddressZero, // TODO change to EF's address
  biddingStartTime: 1657008000, // Jul 05 2022 08:00:00
  biddingEndTime: 1657785540, // Jul 14 2022 07:59:00
  claimingEndTime: 1673683140, // Jan 14 2023 07:59:00
  auctionWinnersCount: 20,
  raffleWinnersCount: 80,
  reservePrice: utils.parseEther('0.25'),
  minBidIncrement: utils.parseEther('0.01'), // currently ~10 USD
}
