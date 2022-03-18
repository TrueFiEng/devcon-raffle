import { Arbitrum, ArbitrumRinkeby, ChainId, Config as UseDAppConfig } from '@usedapp/core'

interface Config {
  useDAppConfig: UseDAppConfig
  allowedNetworks: number[]
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
    },
    allowedNetworks: [ChainId.Arbitrum, ChainId.ArbitrumRinkeby, ChainId.Localhost],
  }
}

function getProdConfig(): Config {
  return {
    useDAppConfig: {
      readOnlyChainId: Arbitrum.chainId,
      readOnlyUrls: {
        [Arbitrum.chainId]: 'https://arb1.arbitrum.io/rpc',
      },
    },
    allowedNetworks: [ChainId.Arbitrum],
  }
}
