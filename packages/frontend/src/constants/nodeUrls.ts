import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@usedapp/core'

export const ARBITRUM_NODE_URL = providerWithInterval(ChainId.Arbitrum, 'https://arb1.arbitrum.io/rpc')
export const ARBITRUM_RINKEBY_NODE_URL = providerWithInterval(ChainId.ArbitrumRinkeby, 'https://rinkeby.arbitrum.io/rpc')
export const HARDHAT_NODE_URL = providerWithInterval(ChainId.Hardhat, 'http://localhost:8545')

function providerWithInterval(chainId: ChainId, url: string) {
  const provider = new JsonRpcProvider(url)
  provider.pollingInterval = 1_000
  return {[chainId]: provider}
}
