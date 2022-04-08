import { Contract, Signer, utils } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { HOUR, YEAR } from 'scripts/utils/consts'
import { devconArtifactName, getDevconLibraries, multicallArtifactName } from 'scripts/utils/devcon'

export const reservePrice = utils.parseEther('0.15')
export const minBidIncrement = utils.parseEther('0.01')

export async function deploy(biddingStartTime: number, deployer: SignerWithAddress, hre: HardhatRuntimeEnvironment): Promise<Contract> {
  const devcon = await deployDevcon(biddingStartTime, deployer, hre)

  const multicallFactory = await hre.ethers.getContractFactory(multicallArtifactName)
  const multicall = await multicallFactory.connect(deployer).deploy()

  console.log('\nDevcon6 address: ', devcon.address)
  console.log('\nMulticall address: ', multicall.address)

  return devcon
}

export async function deployDevcon(biddingStartTime: number, deployer: SignerWithAddress, hre: HardhatRuntimeEnvironment): Promise<Contract> {
  const biddingEndTime = biddingStartTime + HOUR
  const claimingEndTime = biddingEndTime + HOUR

  const libraryLink = await deployMaxHeap(deployer, hre)
  const devconFactory = await hre.ethers.getContractFactory(devconArtifactName, { libraries: libraryLink })
  return devconFactory.connect(deployer).deploy(
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

export async function deployTestnetDevcon(biddingStartTime: number, heapLibraryAddress: string, deployer: SignerWithAddress, hre: HardhatRuntimeEnvironment) {
  const biddingEndTime = biddingStartTime + YEAR
  const claimingEndTime = biddingEndTime + HOUR

  const devconFactory = await hre.ethers.getContractFactory(devconArtifactName, { libraries: getDevconLibraries(heapLibraryAddress) })
  return devconFactory.connect(deployer).deploy(
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

  return getDevconLibraries(heapLibrary.address)
}
