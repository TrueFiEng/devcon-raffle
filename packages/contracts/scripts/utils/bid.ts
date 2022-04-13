import { BigNumberish, Contract, Signer } from 'ethers'

export async function bidAsSigner(devcon: Contract, signer: Signer, value: BigNumberish) {
  await devcon.connect(signer).bid({ value })
}
