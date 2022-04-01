import { Devcon6, Devcon6__factory, Multicall2__factory } from 'contracts'
import { Signer, utils } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const HOUR = 3600
export const reservePrice = utils.parseUnits('0.15', 9)
export const minBidIncrement = utils.parseUnits('0.01', 9)

export async function deploy(biddingStartTime: number, deployer: Signer): Promise<Devcon6> {
  const devcon = await deployDevcon(biddingStartTime, deployer, undefined)
  await deployMulticall(deployer)

  return devcon
}

export async function deployDevcon(biddingStartTime: number, deployer: Signer, hre: HardhatRuntimeEnvironment): Promise<Devcon6> {
  const biddingEndTime = biddingStartTime + HOUR
  const claimingEndTime = biddingEndTime + HOUR

  const libraryLink = await deployMaxHeap(deployer, hre)

  const ownerAddress = await deployer.getAddress()
  const devcon = await new Devcon6__factory(libraryLink, deployer).deploy(
    ownerAddress,
    biddingStartTime,
    biddingEndTime,
    claimingEndTime,
    20,
    8,
    reservePrice,
    minBidIncrement,
  )

  await devcon.deployed()
  const receipt = await devcon.provider.getTransactionReceipt(devcon.deployTransaction.hash)
  console.log(`Devcon6 address: ${devcon.address}, gasUsed: ${receipt.gasUsed}`)

  return devcon
}

export async function deployMaxHeap(deployer: Signer, hre: HardhatRuntimeEnvironment) {
  const heapFactory = await hre.ethers.getContractFactory('MaxHeap')
  const heap = await heapFactory.connect(deployer).deploy()
  await heap.deployed()
  const receipt = await heap.provider.getTransactionReceipt(heap.deployTransaction.hash)

  console.log(`MaxHeap address: ${heap.address}, gasUsed: ${receipt.gasUsed}`)

  return {
    'contracts/utils/MaxHeap.sol:MaxHeap': heap.address,
    __$f92e1b546cb81b0df9056e27145904c2f5$__: heap.address,
  }
}

async function deployMulticall(owner: Signer) {
  const multicall = await new Multicall2__factory(owner).deploy()
  await multicall.deployed()
  console.log(`Multicall address: ${multicall.address}`)
}

