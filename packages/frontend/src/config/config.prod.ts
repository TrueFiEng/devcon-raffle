import { Arbitrum } from '@usedapp/core'
import { providerWithInterval } from 'src/constants/nodeUrls'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig, Config } from './config'
import { getStringEnv } from './getEnv'

export function getProdConfig(): Config {
  const backendUrl = getStringEnv('BACKEND_URL') || ''
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Arbitrum.chainId,
      readOnlyUrls: providerWithInterval(Arbitrum.chainId),
      networks: [Arbitrum],
      pollingInterval: 1000,
    },
    addresses: ADDRESSES,
    backendUrl,
  }
}
