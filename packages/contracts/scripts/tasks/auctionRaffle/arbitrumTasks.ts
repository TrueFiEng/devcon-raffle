import { task } from 'hardhat/config'
import { connectToAuctionRaffle } from 'scripts/utils/auctionRaffle'
import { BigNumber, utils } from 'ethers'

const auctionRaffleAddress = '0xF53d383525117d1f51BF234966E39bD1508a5948'

interface Bid {
  bidderID: BigNumber,
  amount: BigNumber,
  winType: number,
  claimed: boolean,
}

interface BidWithAddress {
  bidder: string,
  bid: Bid,
}

enum WinType {
  LOSS,
  GOLDEN_TICKET,
  AUCTION,
  RAFFLE
}

const reservePrice = utils.parseEther('0.25')

task('withdrawals-stats', 'Prints withdrawals stats')
  .setAction(async (taskArgs, hre) => {
    const auctionRaffle = await connectToAuctionRaffle(hre, auctionRaffleAddress)

    const bids: BidWithAddress[] = await auctionRaffle.getBidsWithAddresses()

    let shouldClaimCount = 0
    let claimedCount = 0

    for (const { bid } of bids) {
      if (shouldClaim(bid)) {
        shouldClaimCount++
        if (bid.claimed) {
          claimedCount++
        }
      }
    }

    console.log(`${claimedCount} accounts have withdrawn,`)
    console.log(`out of ${shouldClaimCount} accounts that had funds to withdraw.`)
  })

function shouldClaim(bid: Bid): boolean {
  if (bid.winType === WinType.AUCTION) {
    return false
  }
  if (bid.winType === WinType.RAFFLE) {
    return bid.amount.gt(reservePrice)
  }
  return true // bid.winType === WinType.GOLDEN_TICKET || bid.winType === WinType.LOSS
}
