import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@usedapp/core'
import { SupportedChainId } from 'src/constants/chainIDs'

const NODE_URLS: Record<SupportedChainId, string> = {
  [ChainId.Arbitrum]: 'https://arb1.arbitrum.io/rpc',
  [ChainId.ArbitrumRinkeby]: 'https://rinkeby.arbitrum.io/rpc',
  [ChainId.Hardhat]: 'http://localhost:8545',
}

export function providerWithInterval(chainId: SupportedChainId, pollingInterval: number) {
  const provider = new JsonRpcProvider(NODE_URLS[chainId])
  provider.pollingInterval = pollingInterval
  return { [chainId]: provider }
}
