import { ArbitrumRinkeby, ChainId } from '@usedapp/core'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig } from './config'
import { getStringEnv } from './getEnv'

export function getTestnetConfig() {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: ArbitrumRinkeby.chainId,
      networks: [ArbitrumRinkeby],
    },
    addresses: getAddresses(),
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
