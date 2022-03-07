import { Devcon6__factory } from 'contracts'
import { utils, Wallet } from 'ethers'
import { MockProvider } from '@ethereum-waffle/provider/dist/esm/MockProvider'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { WEEK } from 'utils/consts'

export const auctionWinnersCount = 20
export const raffleWinnersCount = 80
export const reservePrice = utils.parseEther('0.5')
export const minBidIncrement = utils.parseEther('0.005')

export async function devcon6Fixture(wallets: Wallet[], provider: MockProvider) {
  const startTime = await getLatestBlockTimestamp(provider)
  return devcon6FixtureWithStartTime(startTime)(wallets, provider)
}

export function devcon6FixtureWithStartTime(biddingStartTime: number) {
  return async ([deployer, owner]: Wallet[], provider: MockProvider) => {
    const biddingEndTime = biddingStartTime + WEEK
    const claimingEndTime = biddingEndTime + WEEK
    const devcon = await new Devcon6__factory(deployer).deploy(
      owner.address,
      biddingStartTime,
      biddingEndTime,
      claimingEndTime,
      auctionWinnersCount,
      raffleWinnersCount,
      reservePrice,
      minBidIncrement,
    )

    return { provider, devcon }
  }
}
