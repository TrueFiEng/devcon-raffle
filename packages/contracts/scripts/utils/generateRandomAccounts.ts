import { Wallet } from 'ethers'
import { Provider } from '@ethersproject/providers'

export function generateRandomAccounts(amount: number, provider: Provider) {
  return Array.from({ length: amount }).map(() => Wallet.createRandom().connect(provider))
}
