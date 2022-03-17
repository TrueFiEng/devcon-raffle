import { Devcon6__factory } from "../build/types";
import { utils, Wallet } from "ethers";

const HOUR = 3600

export async function deployDevcon(owner: Wallet) {
  const biddingStartTime = new Date().valueOf() + HOUR
  const biddingEndTime = biddingStartTime + HOUR
  const claimingEndTime = biddingEndTime + HOUR

  const devcon = await new Devcon6__factory(owner).deploy(
    owner.address,
    biddingStartTime,
    biddingEndTime,
    claimingEndTime,
    20,
    80,
    utils.parseEther('0.5'),
    utils.parseEther('0.005'),
  )

  console.log('\nDevcon address: ', devcon.address)
  console.log('Contracts deployed')
}
