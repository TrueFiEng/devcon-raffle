import { Arbitrum, ArbitrumRinkeby, Config as UseDAppConfig, Hardhat } from '@usedapp/core'
import { ADDRESSES } from 'src/config/addresses'
import { SupportedChainId } from 'src/constants/chainIDs'
import { NODE_URLS } from 'src/constants/nodeUrls'

interface Config {
  useDAppConfig: UseDAppConfig
  addresses: Record<string, Record<SupportedChainId, string>>
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
    addresses: ADDRESSES,
  }
}

function getProdConfig(): Config {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Arbitrum.chainId,
      networks: [Arbitrum],
    },
    addresses: ADDRESSES,
  }
}

const commonUseDAppConfig = {
  multicallAddresses: ADDRESSES.multicall,
  readOnlyUrls: NODE_URLS,
}

export const CONFIG = getConfig(import.meta.env.MODE)
