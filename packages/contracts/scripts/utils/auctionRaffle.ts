import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const auctionRaffleAddress = '0x2d7435A78010bB613E1f22E0A8018733dd0C1Cfe'
export const auctionRaffleArtifactName = 'contracts/AuctionRaffle.sol:AuctionRaffle'
export const multicallArtifactName = 'contracts/test/Multicall2.sol:Multicall2'

export async function connectToAuctionRaffle(hre: HardhatRuntimeEnvironment, auctionRaffleAddress: string) {
  const auctionRaffleFactory = await hre.ethers.getContractFactory(auctionRaffleArtifactName)
  return auctionRaffleFactory.attach(auctionRaffleAddress)
}
