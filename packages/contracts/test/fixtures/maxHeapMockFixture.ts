import { Signer, Wallet } from 'ethers'
import { MockProvider } from 'ethereum-waffle'
import { MaxHeapMock__factory } from 'contracts'
import { ethers } from 'hardhat'

export async function maxHeapMockFixture([deployer]: Wallet[], provider: MockProvider) {
  const libraryLink = await deployMaxHeap(deployer)
  const heap = await new MaxHeapMock__factory(libraryLink, deployer).deploy()

  return { heap, provider }
}

export async function deployMaxHeap(deployer: Signer) {
  const heapLibraryFactory = await ethers.getContractFactory('MaxHeap')
  const heapLibrary = await heapLibraryFactory.connect(deployer).deploy()

  return {
    'contracts/libs/MaxHeap.sol:MaxHeap': heapLibrary.address,
    __$3ef75435bd6f8696a9a70764ef1093bd01$__: heapLibrary.address,
  }
}
