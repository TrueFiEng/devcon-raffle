import { Hardhat } from '@usedapp/core'
import { providerWithInterval } from 'src/constants/nodeUrls'
import { POLLING_INTERVAL } from 'src/constants/pollingInterval'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig, Config } from './config'
import { getStringEnv } from './getEnv'

export function getLocalDevConfig(): Config {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Hardhat.chainId,
      readOnlyUrls: providerWithInterval(Hardhat.chainId, POLLING_INTERVAL),
      networks: [Hardhat],
      pollingInterval: POLLING_INTERVAL,
    },
    addresses: ADDRESSES,
    backendUrl: 'http://localhost:3001',
    portisDAppID: getStringEnv('PORTIS_DAPP_ID') || '',
    dappName: 'Devcon Raffle (LOCAL DEV)',
  }
}
