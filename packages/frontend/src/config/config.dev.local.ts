import { Hardhat } from '@usedapp/core'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig } from './config'

export function getLocalConfig() {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Hardhat.chainId,
      networks: [Hardhat],
    },
    addresses: ADDRESSES,
    backendUrl: 'http://localhost:3001',
  }
}
