import { contract, deploy } from 'ethereum-mars'
import { AuctionRaffle } from 'build/artifacts'
import { config } from 'scripts/mars/deploymentConfig'

deploy({verify: true}, deployAuctionRaffle)

function deployAuctionRaffle(deployer: string) {
  contract(AuctionRaffle, [
    deployer, // TODO change to config.initialOwner after we know the address
    config.biddingStartTime,
    config.biddingEndTime,
    config.claimingEndTime,
    config.auctionWinnersCount,
    config.raffleWinnersCount,
    config.reservePrice,
    config.minBidIncrement,
  ])
}
