import { ChainId, getChainById } from '@usedapp/core'

export const getEtherscanChainPrefix = (chainId: ChainId) =>
  chainId !== ChainId.Mainnet ? getChainById(chainId)?.chainName.toLowerCase() + '.' : ''
