import { ChainId } from '@usedapp/core'

export const ARBITRUM_NODE_URL = { [ChainId.Arbitrum]: 'https://arb1.arbitrum.io/rpc' }
export const ARBITRUM_RINKEBY_NODE_URL = { [ChainId.ArbitrumRinkeby]: 'https://rinkeby.arbitrum.io/rpc' }
export const HARDHAT_NODE_URL = { [ChainId.Hardhat]: 'http://localhost:8545' }
