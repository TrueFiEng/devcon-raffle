import { defaultAccounts } from 'ethereum-waffle'
import ganache from 'ganache-core'
import { providers, Wallet, utils, constants } from 'ethers'
import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider";

const PORT = 8545

export function startGanache(): Web3Provider {
  console.log("Starting Genache")
  const server = ganache.server({
    accounts: defaultAccounts,
    gasLimit: 15_000_000,
  })
  server.listen(PORT, '0.0.0.0')
  console.log(`Ganache started at: localhost:${PORT}`)
  console.log('Available accounts')
  console.log('Address\t\t\t\t\t   Private key\t\t\t\t\t\t\t      Balance')
  logAccounts()
  return new providers.Web3Provider(server.provider)
}

function logAccounts() {
  console.log(defaultAccounts.map(
    ({ balance, secretKey }) =>
      `${new Wallet(secretKey).address} ${secretKey} ${formatBalance(balance)}`).join('\n')
  )
}

function formatBalance(balance: string): string {
  return `${utils.formatEther(balance).toString()}${constants.EtherSymbol}`
}
