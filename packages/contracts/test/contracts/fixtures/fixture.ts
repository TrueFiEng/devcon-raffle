import { Example__factory } from 'contracts'
import { Wallet } from 'ethers'

export async function exampleFixture([owner]: Wallet[]) {
  const example = await new Example__factory(owner).deploy()

  return { example }
}