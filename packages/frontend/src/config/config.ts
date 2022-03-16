import { ChainId } from '@usedapp/core'

export const CONFIG = {
  useDAppConfig: {},
  allowedNetworks:
    import.meta.env.MODE === 'development'
      ? [ChainId.Arbitrum, ChainId.ArbitrumRinkeby, ChainId.Localhost]
      : [ChainId.Arbitrum],
}
