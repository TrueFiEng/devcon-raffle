import { Config as UseDAppConfig } from '@usedapp/core'
import { ADDRESSES } from 'src/config/addresses'
import { SupportedChainId } from 'src/constants/chainIDs'
import { NODE_URLS } from 'src/constants/nodeUrls'

import { getLocalConfig } from './config.dev.local'
import { getTestnetConfig } from './config.dev.testnet'
import { getProdConfig } from './config.prod'
import { getStringEnv } from './getEnv'

export interface Config {
  useDAppConfig: UseDAppConfig
  addresses: Record<string, Record<SupportedChainId, string>>
  backendUrl: string
}

function getConfig(mode: string): Config {
  switch (mode) {
    case 'development':
      return getDevConfig()
    default:
      return getProdConfig()
  }
}

function getDevConfig(): Config {
  const network = getStringEnv('VITE_NETWORK')
  const backendUrl = 'http://localhost:3001'

  switch (network) {
    case 'ArbitrumRinkeby':
      return { ...getTestnetConfig(), backendUrl }
    default:
      return { ...getLocalConfig(), backendUrl }
  }
}

export const commonUseDAppConfig: UseDAppConfig = {
  multicallAddresses: ADDRESSES.multicall,
  multicallVersion: 2,
  readOnlyUrls: NODE_URLS,
}

export const CONFIG = getConfig(import.meta.env.MODE)
