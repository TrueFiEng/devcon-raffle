import { Wallet } from 'ethers'
import { Hashing__factory } from 'contracts'

export async function hashingFixture([deployer]: Wallet[]) {
  return new Hashing__factory(deployer).deploy()
}
