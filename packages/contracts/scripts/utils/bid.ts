import { BigNumberish, Contract, Signer } from 'ethers'

export async function bidAsSigner(auctionRaffle: Contract, signer: Signer, value: BigNumberish) {
  await auctionRaffle.connect(signer).bid({ value, gasLimit: 1_000_000 })
}
