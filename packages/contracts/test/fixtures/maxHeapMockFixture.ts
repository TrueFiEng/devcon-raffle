import { Wallet } from 'ethers'
import { MockProvider } from 'ethereum-waffle'
import { MaxHeapMock__factory } from 'contracts'

export async function maxHeapMockFixture([deployer]: Wallet[], provider: MockProvider) {
  const heap = await new MaxHeapMock__factory(deployer).deploy()

  return { heap, provider }
}
