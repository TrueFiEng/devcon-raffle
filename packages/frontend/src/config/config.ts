import { Arbitrum, ArbitrumRinkeby, ChainId, Hardhat } from '@usedapp/core'
import { ADDRESSES } from 'src/constants/addresses'

export const CONFIG = {
  useDAppConfig: {
    multicallAddresses: ADDRESSES.multicall,
    networks: [Hardhat, ArbitrumRinkeby, Arbitrum],
  },
  allowedNetworks:
    import.meta.env.MODE === 'development'
      ? [ChainId.Arbitrum, ChainId.ArbitrumRinkeby, ChainId.Hardhat]
      : [ChainId.Arbitrum],
}
