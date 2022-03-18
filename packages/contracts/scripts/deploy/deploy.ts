import { Devcon6, Devcon6__factory } from 'contracts'
import { Signer, utils } from 'ethers'

const HOUR = 3600
export const reservePrice = utils.parseEther('0.5')

export async function deployDevcon(biddingStartTime: number, owner: Signer): Promise<Devcon6> {
  const biddingEndTime = biddingStartTime + HOUR
  const claimingEndTime = biddingEndTime + HOUR

  const ownerAddress = await owner.getAddress()

  const devcon = await new Devcon6__factory(owner).deploy(
    ownerAddress,
    biddingStartTime,
    biddingEndTime,
    claimingEndTime,
    20,
    80,
    reservePrice,
    utils.parseEther('0.005'),
  )

  console.log('\nDevcon6 address: ', devcon.address)
  return devcon
}
