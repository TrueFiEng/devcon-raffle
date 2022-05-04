import { ArbitrumRinkeby } from '@usedapp/core'
import { providerWithInterval } from 'src/constants/nodeUrls'

import { getAddresses } from './addresses'
import { commonUseDAppConfig } from './config'

export function getTestnetDevConfig() {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: ArbitrumRinkeby.chainId,
      readOnlyUrls: providerWithInterval(ArbitrumRinkeby.chainId),
      networks: [ArbitrumRinkeby],
      pollingInterval: 1000,
    },
    addresses: getAddresses(),
    backendUrl: 'http://localhost:3001',
  }
}
