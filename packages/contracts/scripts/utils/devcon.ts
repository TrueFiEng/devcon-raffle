import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const heapAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const heapArtifactName = 'contracts/utils/MaxHeap.sol:MaxHeap'
export const devconAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const devconArtifactName = 'contracts/Devcon6.sol:Devcon6'

export async function connectToDevcon(hre: HardhatRuntimeEnvironment, devconAddress: string, heapAddress: string) {
  const devconFactory = await hre.ethers.getContractFactory(devconArtifactName, { libraries: getDevconLibraries(heapAddress) })
  return devconFactory.attach(devconAddress)
}

export function getDevconLibraries(maxHeapAddress: string) {
  return {
    [heapArtifactName]: maxHeapAddress,
  }
}
