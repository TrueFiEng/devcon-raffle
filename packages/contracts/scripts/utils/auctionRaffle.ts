import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const auctionRaffleArtifactName = 'contracts/AuctionRaffle.sol:AuctionRaffle'
export const multicallArtifactName = 'contracts/test/Multicall2.sol:Multicall2'

export async function connectToAuctionRaffle(hre: HardhatRuntimeEnvironment, auctionRaffleAddress: string) {
  const auctionRaffleFactory = await hre.ethers.getContractFactory(auctionRaffleArtifactName)
  return auctionRaffleFactory.attach(auctionRaffleAddress)
}
