import { Contract, Signer, utils } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { HOUR, YEAR } from 'scripts/utils/consts'
import { auctionRaffleArtifactName, getAuctionRaffleLibraries, multicallArtifactName } from 'scripts/utils/auctionRaffle'

export const reservePrice = utils.parseEther('0.15')
export const minBidIncrement = utils.parseEther('0.01')
export const minStateDuration = 6 * HOUR

export async function deploy(biddingStartTime: number, deployer: SignerWithAddress, hre: HardhatRuntimeEnvironment): Promise<Contract> {
  const auctionRaffle = await deployAuctionRaffle(biddingStartTime, deployer, hre)

  const multicallFactory = await hre.ethers.getContractFactory(multicallArtifactName)
  const multicall = await multicallFactory.connect(deployer).deploy()

  console.log('\nAuctionRaffle address: ', auctionRaffle.address)
  console.log('\nMulticall address: ', multicall.address)

  return auctionRaffle
}

export async function deployAuctionRaffle(biddingStartTime: number, deployer: SignerWithAddress, hre: HardhatRuntimeEnvironment): Promise<Contract> {
  const biddingEndTime = biddingStartTime + minStateDuration
  const claimingEndTime = biddingEndTime + minStateDuration

  const libraryLink = await deployMaxHeap(deployer, hre)
  const auctionRaffleFactory = await hre.ethers.getContractFactory(auctionRaffleArtifactName, { libraries: libraryLink })
  return auctionRaffleFactory.connect(deployer).deploy(
    deployer.address,
    biddingStartTime,
    biddingEndTime,
    claimingEndTime,
    20,
    80,
    reservePrice,
    minBidIncrement,
  )
}

export async function deployTestnetAuctionRaffle(biddingStartTime: number, heapLibraryAddress: string, deployer: SignerWithAddress, hre: HardhatRuntimeEnvironment) {
  const biddingEndTime = biddingStartTime + YEAR
  const claimingEndTime = biddingEndTime + minStateDuration

  const auctionRaffleFactory = await hre.ethers.getContractFactory(auctionRaffleArtifactName, { libraries: getAuctionRaffleLibraries(heapLibraryAddress) })
  return auctionRaffleFactory.connect(deployer).deploy(
    deployer.address,
    biddingStartTime,
    biddingEndTime,
    claimingEndTime,
    10,
    8,
    utils.parseUnits('0.15', 9),
    utils.parseUnits('0.01', 9),
  )
}

export async function deployMaxHeap(deployer: Signer, hre: HardhatRuntimeEnvironment) {
  const heapLibraryFactory = await hre.ethers.getContractFactory('MaxHeap')
  const heapLibrary = await heapLibraryFactory.connect(deployer).deploy()
  console.log('\nMaxHeap address: ', heapLibrary.address)

  return getAuctionRaffleLibraries(heapLibrary.address)
}
