import { Arbitrum, ArbitrumRinkeby, ChainId, Hardhat } from '@usedapp/core'
import { ADDRESSES } from 'src/constants/addresses'

export type SupportedChainId = ChainId.Hardhat | ChainId.Arbitrum | ChainId.ArbitrumRinkeby
const supportedChains = [ChainId.Arbitrum, ChainId.ArbitrumRinkeby, ChainId.Hardhat]

export const CONFIG = {
  useDAppConfig: {
    multicallAddresses: ADDRESSES.multicall,
    networks: [Hardhat, ArbitrumRinkeby, Arbitrum],
  },
  allowedNetworks: import.meta.env.MODE === 'development' ? supportedChains : [ChainId.Arbitrum],
}

export function isSupportedChain(chainId: ChainId): chainId is SupportedChainId {
  return supportedChains.includes(chainId)
}
