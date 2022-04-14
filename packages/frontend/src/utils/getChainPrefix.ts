import { ChainId } from '@usedapp/core'
import { getChainById } from '@usedapp/core/internal'

export const getChainPrefix = (chainId: ChainId) =>
  chainId !== ChainId.Mainnet ? getChainById(chainId)?.chainName.toLowerCase() + '.' : ''
