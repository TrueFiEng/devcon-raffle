import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const heapAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const heapArtifactName = 'contracts/libs/MaxHeap.sol:MaxHeap'
export const auctionRaffleAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const auctionRaffleArtifactName = 'contracts/AuctionRaffle.sol:AuctionRaffle'
export const multicallArtifactName = 'contracts/test/Multicall2.sol:Multicall2'

export async function connectToAuctionRaffle(hre: HardhatRuntimeEnvironment, auctionRaffleAddress: string, heapAddress: string) {
  const auctionRaffleFactory = await hre.ethers.getContractFactory(auctionRaffleArtifactName, { libraries: getAuctionRaffleLibraries(heapAddress) })
  return auctionRaffleFactory.attach(auctionRaffleAddress)
}

export function getAuctionRaffleLibraries(maxHeapAddress: string) {
  return {
    [heapArtifactName]: maxHeapAddress,
  }
}
