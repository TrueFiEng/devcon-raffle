import { ChainId } from '@usedapp/core'

export type SupportedChainId = ChainId.Arbitrum | ChainId.ArbitrumRinkeby | ChainId.Hardhat
const supportedChains = [ChainId.Arbitrum, ChainId.ArbitrumRinkeby, ChainId.Hardhat]

export function isSupportedChain(chainId: ChainId): chainId is SupportedChainId {
  return supportedChains.includes(chainId)
}
