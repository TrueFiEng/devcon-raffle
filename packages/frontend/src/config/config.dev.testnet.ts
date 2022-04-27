import { ArbitrumRinkeby, ChainId } from '@usedapp/core'
import { providerWithInterval } from 'src/constants/nodeUrls'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig } from './config'
import { getStringEnv } from './getEnv'

export function getTestnetConfig() {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: ArbitrumRinkeby.chainId,
      readOnlyUrls: providerWithInterval(ArbitrumRinkeby.chainId),
      networks: [ArbitrumRinkeby],
    },
    addresses: getAddresses(),
    backendUrl: 'http://localhost:3001',
  }
}

function getAddresses() {
  const addresses = ADDRESSES
  const devcon = getStringEnv('VITE_TESTNET_DEVCON')
  if (devcon) {
    addresses['devcon'][ChainId.ArbitrumRinkeby] = devcon
  }
  return addresses
}
