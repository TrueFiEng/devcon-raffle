import { ChainId, getChainById } from '@usedapp/core'

export const getChainPrefix = (chainId: ChainId) =>
  chainId !== ChainId.Mainnet ? getChainById(chainId)?.chainName.toLowerCase() + '.' : ''
