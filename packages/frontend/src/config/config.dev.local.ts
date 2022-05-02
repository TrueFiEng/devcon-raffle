import { Hardhat } from '@usedapp/core'
import { HARDHAT_NODE_URL } from 'src/constants/nodeUrls'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig } from './config'

export function getLocalDevConfig() {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Hardhat.chainId,
      readOnlyUrls: HARDHAT_NODE_URL,
      networks: [Hardhat],
    },
    addresses: ADDRESSES,
    backendUrl: 'http://localhost:3001',
  }
}
