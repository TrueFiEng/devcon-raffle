import { useEthers } from '@usedapp/core'

import { isSupportedChainId, SupportedChainId } from '../../constants/chainIDs'

export function useInjectedProviderChainId(): SupportedChainId | undefined {
  const { chainId } = useEthers()

  if (chainId === undefined) {
    return undefined
  }

  if (!isSupportedChainId(chainId)) {
    throw new Error('chainId returned by useEthers is not one of SupportedChainIds')
  }

  return chainId
}
