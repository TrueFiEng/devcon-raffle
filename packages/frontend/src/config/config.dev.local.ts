import { Arbitrum, ArbitrumRinkeby, Hardhat } from '@usedapp/core'

import { ADDRESSES } from './addresses'
import { commonUseDAppConfig } from './config'

export function getLocalConfig() {
  return {
    useDAppConfig: {
      ...commonUseDAppConfig,
      readOnlyChainId: Hardhat.chainId,
      networks: [Hardhat, ArbitrumRinkeby, Arbitrum],
    },
    addresses: ADDRESSES,
  }
}
