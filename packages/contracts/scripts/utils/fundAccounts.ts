import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BigNumber, providers, Wallet } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

export async function fundAccounts(genesisSigner: SignerWithAddress, accounts: Wallet[], reservePrice: BigNumber, minBidIncrement: BigNumber) {
  const txs: Promise<providers.TransactionResponse>[] = []

  for (let i = 0; i < accounts.length; i++) {
    const ethRequired = reservePrice.add(minBidIncrement.mul(i)).add(parseEther('0.1')) // Adding 0.1 ETH for gas
    txs.push(genesisSigner.sendTransaction({
      to: accounts[i].address,
      value: ethRequired,
    }))
  }

  await Promise.all(txs)
}
