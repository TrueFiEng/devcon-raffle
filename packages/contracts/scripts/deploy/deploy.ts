import { Devcon6, Devcon6__factory, Multicall2__factory } from 'contracts'
import { Signer, utils } from 'ethers'

const HOUR = 3600
export const reservePrice = utils.parseEther('0.15')
const minBidIncrement = utils.parseEther('0.01')

export async function deploy(biddingStartTime: number, owner: Signer): Promise<Devcon6> {
  const devcon = await deployDevcon(biddingStartTime, owner)
  const multicall = await new Multicall2__factory(owner).deploy()

  console.log('\nDevcon6 address: ', devcon.address)
  console.log('\nMulticall address: ', multicall.address)

  return devcon
}

export async function deployDevcon(biddingStartTime: number, owner: Signer): Promise<Devcon6> {
  const biddingEndTime = biddingStartTime + HOUR
  const claimingEndTime = biddingEndTime + HOUR

  const ownerAddress = await owner.getAddress()

  return new Devcon6__factory(owner).deploy(
    ownerAddress,
    biddingStartTime,
    biddingEndTime,
    claimingEndTime,
    20,
    80,
    reservePrice,
    minBidIncrement,
  )
}
