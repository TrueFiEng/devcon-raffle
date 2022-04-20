import { Arbitrum } from '@usedapp/core'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig, Config } from './config'
import { getStringEnv } from './getEnv'

export function getProdConfig(): Config {
  const backendUrl = getStringEnv('BACKEND_URL') || ''
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Arbitrum.chainId,
      networks: [Arbitrum],
    },
    addresses: ADDRESSES,
    backendUrl,
  }
}
