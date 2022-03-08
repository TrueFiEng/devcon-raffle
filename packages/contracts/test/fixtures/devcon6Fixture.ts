import { Devcon6__factory } from 'contracts'
import { BigNumberish, utils, Wallet } from 'ethers'
import { MockProvider } from '@ethereum-waffle/provider/dist/esm/MockProvider'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { WEEK } from 'utils/consts'

export const auctionWinnersCount = 1
export const raffleWinnersCount = 1
export const reservePrice = utils.parseEther('0.5')
export const minBidIncrement = utils.parseEther('0.005')

export async function devcon6Fixture(wallets: Wallet[], provider: MockProvider) {
  return configuredDevcon6Fixture({})(wallets, provider)
}

export function configuredDevcon6Fixture(params: devcon6Params) {
  return async ([deployer, owner]: Wallet[], provider: MockProvider) => {
    const currentBlockTimestamp = await getLatestBlockTimestamp(provider)
    params = setDevcon6ParamsDefaults(owner, currentBlockTimestamp , params)
    const devcon = await new Devcon6__factory(deployer).deploy(
      params.initialOwner,
      params.biddingStartTime,
      params.biddingEndTime,
      params.claimingEndTime,
      params.auctionWinnersCount,
      params.raffleWinnersCount,
      params.reservePrice,
      params.minBidIncrement,
    )

    return { provider, devcon }
  }
}

export type devcon6Params = {
  initialOwner?: string,
  biddingStartTime?: number,
  biddingEndTime?: number,
  claimingEndTime?: number,
  auctionWinnersCount?: BigNumberish,
  raffleWinnersCount?: BigNumberish,
  reservePrice?: BigNumberish,
  minBidIncrement?: BigNumberish,
}

export function setDevcon6ParamsDefaults(owner: Wallet, blockTimestamp: number, params: devcon6Params): devcon6Params {
  return { ...defaultDevcon6Params(owner, blockTimestamp), ...params }
}

function defaultDevcon6Params(owner: Wallet, biddingStartTime: number): devcon6Params {
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
