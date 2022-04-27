import { Hardhat } from '@usedapp/core'
import { providerWithInterval } from 'src/constants/nodeUrls'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig, Config } from './config'

export function getLocalConfig(): Config {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Hardhat.chainId,
      readOnlyUrls: providerWithInterval(Hardhat.chainId),
      networks: [Hardhat],
      pollingInterval: 1000,
    },
    addresses: ADDRESSES,
    backendUrl: 'http://localhost:3001',
  }
}
