import { Wallet } from 'ethers'
import { MockProvider } from 'ethereum-waffle'
import { MaxHeapMock__factory } from 'contracts'
import { ethers } from 'hardhat'

export async function maxHeapMockFixture([deployer]: Wallet[], provider: MockProvider) {
  const heapLibraryFactory = await ethers.getContractFactory('MaxHeap')
  const heapLibrary = await heapLibraryFactory.deploy()

  const libraryLink = {
    'contracts/utils/MaxHeap.sol:MaxHeap': heapLibrary.address,
    __$f92e1b546cb81b0df9056e27145904c2f5$__: heapLibrary.address,
  }
  const heap = await new MaxHeapMock__factory(libraryLink, deployer).deploy()

  return { heap, provider }
}
