import { Arbitrum } from '@usedapp/core'
import { providerWithInterval } from 'src/constants/nodeUrls'
import { POLLING_INTERVAL } from 'src/constants/pollingInterval'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig, Config } from './config'
import { getStringEnv } from './getEnv'

export function getMainnetProdConfig(): Config {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Arbitrum.chainId,
      readOnlyUrls: providerWithInterval(Arbitrum.chainId, POLLING_INTERVAL),
      networks: [Arbitrum],
      pollingInterval: POLLING_INTERVAL,
    },
    addresses: ADDRESSES,
    backendUrl: getStringEnv('BACKEND_URL') || '',
    portisDAppID: getStringEnv('PORTIS_DAPP_ID') || '',
  }
}
