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
