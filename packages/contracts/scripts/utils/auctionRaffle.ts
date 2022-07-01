import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const auctionRaffleAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const auctionRaffleArtifactName = 'contracts/AuctionRaffle.sol:AuctionRaffle'
export const multicallArtifactName = 'contracts/test/Multicall2.sol:Multicall2'

export async function connectToAuctionRaffle(hre: HardhatRuntimeEnvironment, auctionRaffleAddress: string) {
  const auctionRaffleFactory = await hre.ethers.getContractFactory(auctionRaffleArtifactName)
  return auctionRaffleFactory.attach(auctionRaffleAddress)
}
