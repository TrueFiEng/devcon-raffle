import { Devcon6, Devcon6__factory, Multicall2__factory } from 'contracts'
import { Signer, utils } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const HOUR = 3600
const DAY = 24 * HOUR
const YEAR = 365 * DAY
export const reservePrice = utils.parseEther('0.15')
export const minBidIncrement = utils.parseEther('0.01')

export async function deploy(biddingStartTime: number, owner: Signer): Promise<Devcon6> {
  const devcon = await deployDevcon(biddingStartTime, owner, undefined)
  const multicall = await new Multicall2__factory(owner).deploy()

  console.log('\nDevcon6 address: ', devcon.address)
  console.log('\nMulticall address: ', multicall.address)

  return devcon
}

export async function deployDevcon(biddingStartTime: number, owner: Signer, hre: HardhatRuntimeEnvironment): Promise<Devcon6> {
  const biddingEndTime = biddingStartTime + HOUR
  const claimingEndTime = biddingEndTime + HOUR

  const ownerAddress = await owner.getAddress()
  const libraryLink = await deployMaxHeap(owner, hre)
  return new Devcon6__factory(libraryLink, owner).deploy(
    ownerAddress,
    biddingStartTime,
    biddingEndTime,
    claimingEndTime,
    20,
    80,
    reservePrice,
    minBidIncrement,
  )
}

export async function deployTestnetDevcon(biddingStartTime: number, deployer: SignerWithAddress, hre: HardhatRuntimeEnvironment) {
  const biddingEndTime = biddingStartTime + YEAR
  const claimingEndTime = biddingEndTime + HOUR

  const libraryLink = await deployMaxHeap(deployer, hre)
  return new Devcon6__factory(libraryLink, deployer).deploy(
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

  return {
    'contracts/utils/MaxHeap.sol:MaxHeap': heapLibrary.address,
    __$3ef75435bd6f8696a9a70764ef1093bd01$__: heapLibrary.address,
  }
}
