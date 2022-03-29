import { Arbitrum, ArbitrumRinkeby, Config as UseDAppConfig, Localhost } from '@usedapp/core'

interface Config {
  useDAppConfig: UseDAppConfig
}

export const CONFIG = getConfig(import.meta.env.MODE)

function getConfig(environment: string): Config {
  switch (environment) {
    case 'development':
      return getDevConfig()
    default:
      return getProdConfig()
  }
}

function getDevConfig(): Config {
  return {
    useDAppConfig: {
      readOnlyChainId: ArbitrumRinkeby.chainId,
      readOnlyUrls: {
        [ArbitrumRinkeby.chainId]: 'https://rinkeby.arbitrum.io/rpc',
      },
      networks: [Localhost, ArbitrumRinkeby, Arbitrum],
    },
  }
}

function getProdConfig(): Config {
  return {
    useDAppConfig: {
      readOnlyChainId: Arbitrum.chainId,
      readOnlyUrls: {
        [Arbitrum.chainId]: 'https://arb1.arbitrum.io/rpc',
      },
      networks: [Arbitrum],
    },
  }
}



// export type SupportedChainId = ChainId.Hardhat | ChainId.Arbitrum | ChainId.ArbitrumRinkeby
// const supportedChains = [ChainId.Arbitrum, ChainId.ArbitrumRinkeby, ChainId.Hardhat]
//
// export const CONFIG = {
//   useDAppConfig: {
//     multicallAddresses: ADDRESSES.multicall,
//     networks: [Hardhat, ArbitrumRinkeby, Arbitrum],
//   },
//   allowedNetworks: import.meta.env.MODE === 'development' ? supportedChains : [ChainId.Arbitrum],
// }
//
// export function isSupportedChain(chainId: ChainId): chainId is SupportedChainId {
//   return supportedChains.includes(chainId)
// }
