import { AuctionRaffleMock__factory, ExampleToken__factory } from 'contracts'
import { BigNumberish, utils, Wallet } from 'ethers'
import { MockProvider } from 'ethereum-waffle'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { WEEK } from 'scripts/utils/consts'

export const auctionWinnersCount = 1
export const raffleWinnersCount = 8
export const reservePrice = utils.parseEther('0.5')
export const minBidIncrement = utils.parseEther('0.005')

export type auctionRaffleParams = {
  initialOwner?: string,
  biddingStartTime?: number,
  biddingEndTime?: number,
  claimingEndTime?: number,
  auctionWinnersCount?: number,
  raffleWinnersCount?: number,
  reservePrice?: BigNumberish,
  minBidIncrement?: BigNumberish,
}

export function auctionRaffleFixture(wallets: Wallet[], provider: MockProvider) {
  return configuredAuctionRaffleFixture({})(wallets, provider)
}

export async function auctionRaffleFixtureWithToken(wallets: Wallet[], provider: MockProvider) {
  // deploy auctionRaffle and exampleToken contracts, because loadFixture creates new provider on each call
  const { auctionRaffle } = await configuredAuctionRaffleFixture({})(wallets, provider)
  const exampleToken = await new ExampleToken__factory(wallets[1]).deploy(1000)

  return { provider, auctionRaffle, exampleToken }
}

export async function auctionRaffleE2EFixture(wallets: Wallet[], provider: MockProvider) {
  return configuredAuctionRaffleFixture({
    auctionWinnersCount: 20,
    raffleWinnersCount: 80,
  })(wallets, provider)
}

export function configuredAuctionRaffleFixture(params: auctionRaffleParams) {
  return async ([deployer, owner]: Wallet[], provider: MockProvider) => {
    const currentBlockTimestamp = await getLatestBlockTimestamp(provider)
    params = setAuctionRaffleParamsDefaults(owner, currentBlockTimestamp, params)

    const auctionRaffle = await new AuctionRaffleMock__factory(deployer).deploy(
      params.initialOwner,
      params.biddingStartTime,
      params.biddingEndTime,
      params.claimingEndTime,
      params.auctionWinnersCount,
      params.raffleWinnersCount,
      params.reservePrice,
      params.minBidIncrement,
    )

    return { provider, auctionRaffle }
  }
}

export function setAuctionRaffleParamsDefaults(owner: Wallet, blockTimestamp: number, params: auctionRaffleParams): auctionRaffleParams {
  return { ...defaultAuctionRaffleParams(owner, blockTimestamp), ...params }
}

function defaultAuctionRaffleParams(owner: Wallet, biddingStartTime: number): auctionRaffleParams {
  return {
    initialOwner: owner.address,
    biddingStartTime: biddingStartTime,
    biddingEndTime: biddingStartTime + WEEK,
    claimingEndTime: biddingStartTime + 2 * WEEK,
    auctionWinnersCount: auctionWinnersCount,
    raffleWinnersCount: raffleWinnersCount,
    reservePrice: reservePrice,
    minBidIncrement: minBidIncrement,
  }
}
