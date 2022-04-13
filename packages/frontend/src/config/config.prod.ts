import { Arbitrum } from '@usedapp/core'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig, Config } from './config'

export function getProdConfig(): Config {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Arbitrum.chainId,
      networks: [Arbitrum],
    },
    addresses: ADDRESSES,
  }
}
