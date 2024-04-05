import {
  AuctionRaffleMock__factory,
  ExampleToken__factory,
  MockLinkToken__factory,
  ScoreAttestationVerifier__factory,
  VrfCoordinatorV2MockWithErc677__factory,
} from 'contracts'
import { BigNumberish, utils, Wallet } from 'ethers'
import { MockProvider } from 'ethereum-waffle'
import { getLatestBlockTimestamp } from 'utils/getLatestBlockTimestamp'
import { WEEK } from 'scripts/utils/consts'
import { parseEther, parseUnits, solidityKeccak256 } from 'ethers/lib/utils'

export const auctionWinnersCount = 1
export const raffleWinnersCount = 8
export const reservePrice = utils.parseEther('0.5')
export const minBidIncrement = utils.parseEther('0.005')

export type auctionRaffleParams = {
  initialOwner?: string
  biddingStartTime?: number
  biddingEndTime?: number
  claimingEndTime?: number
  auctionWinnersCount?: number
  raffleWinnersCount?: number
  reservePrice?: BigNumberish
  minBidIncrement?: BigNumberish
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

export function configuredAuctionRaffleFixture(configParams: auctionRaffleParams) {
  return async ([deployer, owner]: Wallet[], provider: MockProvider) => {
    const currentBlockTimestamp = await getLatestBlockTimestamp(provider as any)
    configParams = setAuctionRaffleParamsDefaults(owner, currentBlockTimestamp, configParams)

    // Mock mintable LINK token
    const linkToken = await new MockLinkToken__factory(deployer).deploy()
    await linkToken.grantMintAndBurnRoles(deployer.address)
    await linkToken.mint(deployer.address, parseEther('1000'))

    const vrfCoordinator = await new VrfCoordinatorV2MockWithErc677__factory(deployer).deploy(
      parseEther('0.005'),
      parseUnits('1', 'gwei'),
      linkToken.address
    )
    // Create sub
    const subId = await vrfCoordinator.callStatic.createSubscription()
    await vrfCoordinator.createSubscription()

    // Fund sub
    await linkToken.transferAndCall(
      vrfCoordinator.address,
      parseEther('100'),
      utils.defaultAbiCoder.encode(['uint64'], [subId])
    )

    const vrfRequesterParams = {
      vrfCoordinator: vrfCoordinator.address,
      linkToken: linkToken.address,
      linkPremium: parseEther('0.005'),
      gasLaneKeyHash: '0x72d2b016bb5b62912afea355ebf33b91319f828738b111b723b78696b9847b63', // 30 gwei
      callbackGasLimit: 10_000_000, // maximum
      minConfirmations: 1, // minimum
      subId,
    }

    // Deploy an attestation verifier
    const attestor = Wallet.createRandom()
    const scoreAttestationVerifier = await new ScoreAttestationVerifier__factory(deployer).deploy(
      '1',
      attestor.address,
      20 * 10 ** 8 // 20.0
    )

    const auctionRaffle = await new AuctionRaffleMock__factory(deployer).deploy(
      configParams.initialOwner,
      {
        biddingStartTime: configParams.biddingStartTime,
        biddingEndTime: configParams.biddingEndTime,
        claimingEndTime: configParams.claimingEndTime,
        auctionWinnersCount: configParams.auctionWinnersCount,
        raffleWinnersCount: configParams.raffleWinnersCount,
        reservePrice: configParams.reservePrice,
        minBidIncrement: configParams.minBidIncrement,
        bidVerifier: scoreAttestationVerifier.address,
      },
      vrfRequesterParams
    )

    // Whitelist auctionRaffle as VRF consumer on this subscription
    await vrfCoordinator.addConsumer(subId, auctionRaffle.address)

    return {
      provider,
      auctionRaffle,
      vrfCoordinator,
      subId,
      linkToken,
      attestor,
      scoreAttestationVerifier,
    }
  }
}

export function setAuctionRaffleParamsDefaults(
  owner: Wallet,
  blockTimestamp: number,
  params: auctionRaffleParams
): auctionRaffleParams {
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
