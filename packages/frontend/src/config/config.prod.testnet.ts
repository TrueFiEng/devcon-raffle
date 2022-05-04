import { ArbitrumRinkeby } from '@usedapp/core'
import { providerWithInterval } from 'src/constants/nodeUrls'
import { POLLING_INTERVAL } from 'src/constants/pollingInterval'

import { getAddresses } from './addresses'
import { commonUseDAppConfig } from './config'
import { getStringEnv } from './getEnv'

export function getTestnetProdConfig() {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: ArbitrumRinkeby.chainId,
      readOnlyUrls: providerWithInterval(ArbitrumRinkeby.chainId, POLLING_INTERVAL),
      networks: [ArbitrumRinkeby],
      pollingInterval: POLLING_INTERVAL,
    },
    addresses: getAddresses(),
    backendUrl: getStringEnv('BACKEND_URL') || '',
  }
}
