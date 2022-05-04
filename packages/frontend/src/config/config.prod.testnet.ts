import { ArbitrumRinkeby } from '@usedapp/core'
import { providerWithInterval } from 'src/constants/nodeUrls'

import { getAddresses } from './addresses'
import { commonUseDAppConfig } from './config'
import { getStringEnv } from './getEnv'

export function getTestnetProdConfig() {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: ArbitrumRinkeby.chainId,
      readOnlyUrls: providerWithInterval(ArbitrumRinkeby.chainId),
      networks: [ArbitrumRinkeby],
    },
    addresses: getAddresses(),
    backendUrl: getStringEnv('BACKEND_URL') || '',
  }
}
