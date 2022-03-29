import { ChainId } from '@usedapp/core'

import { SupportedChainId } from './chainIDs'

export const NODE_URLS: Record<SupportedChainId, string> = {
  [ChainId.Arbitrum]: 'https://arb1.arbitrum.io/rpc',
  [ChainId.ArbitrumRinkeby]: 'https://rinkeby.arbitrum.io/rpc',
  [ChainId.Hardhat]: 'http://localhost:8545',
}
