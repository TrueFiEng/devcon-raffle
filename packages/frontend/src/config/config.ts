import { Arbitrum, ArbitrumRinkeby, Config as UseDAppConfig, Hardhat } from '@usedapp/core'

import { NODE_URLS } from '../constants/nodeUrls'

import { ADDRESSES } from './addresses'

interface Config {
  useDAppConfig: UseDAppConfig
}

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
      ...commonUseDAppConfig,
      readOnlyChainId: Hardhat.chainId,
      networks: [Hardhat, ArbitrumRinkeby, Arbitrum],
    },
  }
}

function getProdConfig(): Config {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Arbitrum.chainId,
      networks: [Arbitrum],
    },
  }
}

const commonUseDAppConfig = {
  multicallAddresses: ADDRESSES.multicall,
  readOnlyUrls: NODE_URLS,
}

export const CONFIG = getConfig(import.meta.env.MODE)
