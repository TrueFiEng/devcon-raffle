import { Devcon6__factory } from "../build/types";
import { Signer, utils } from "ethers";

const HOUR = 3600

export async function deployDevcon(owner: Signer) {
  const biddingStartTime = new Date().valueOf() + HOUR
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
    utils.parseEther('0.5'),
    utils.parseEther('0.005'),
  )

  console.log('\nDevcon6 address: ', devcon.address)
}
