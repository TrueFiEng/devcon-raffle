import { ChainId } from '@usedapp/core'
import { ADDRESSES } from "src/constants/addresses"

export const CONFIG = {
  useDAppConfig: {
    multicallAddresses: ADDRESSES.multicall
  },
  allowedNetworks:
    import.meta.env.MODE === 'development'
      ? [ChainId.Arbitrum, ChainId.ArbitrumRinkeby, ChainId.Localhost]
      : [ChainId.Arbitrum],
}
