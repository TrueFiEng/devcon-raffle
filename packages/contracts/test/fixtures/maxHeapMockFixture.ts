import { Wallet } from 'ethers'
import { MockProvider } from 'ethereum-waffle'
import { MaxHeapMock__factory } from 'contracts'
import { deployMaxHeap } from 'scripts/deploy/deploy'

export async function maxHeapMockFixture([deployer]: Wallet[], provider: MockProvider) {
  const libraryLink = await deployMaxHeap(deployer, hre)
  const heap = await new MaxHeapMock__factory(libraryLink, deployer).deploy()

  return { heap, provider }
}
