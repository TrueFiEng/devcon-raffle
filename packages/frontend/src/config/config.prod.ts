import { Arbitrum } from '@usedapp/core'
import { ARBITRUM_NODE_URL } from 'src/constants/nodeUrls'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig, Config } from './config'
import { getStringEnv } from './getEnv'

export function getProdConfig(): Config {
  const backendUrl = getStringEnv('BACKEND_URL') || ''
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Arbitrum.chainId,
      readOnlyUrls: ARBITRUM_NODE_URL,
      networks: [Arbitrum],
    },
    addresses: ADDRESSES,
    backendUrl,
  }
}
