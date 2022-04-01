import { Devcon6 } from 'contracts'
import { BigNumberish, Signer } from 'ethers'

export async function bidAsSigner(devcon: Devcon6, signer: Signer, value: BigNumberish) {
  await devcon.connect(signer).bid(await signer.getAddress(), { value })
}
