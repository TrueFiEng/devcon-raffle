import { useConfig } from '@usedapp/core'

import { isSupportedChainId, SupportedChainId } from '../../constants/chainIDs'

export function useReadOnlyChainId(): SupportedChainId {
  const { readOnlyChainId } = useConfig()

  if (readOnlyChainId === undefined) {
    throw new Error('readOnlyChainId is not set in useDApp config')
  }

  if (!isSupportedChainId(readOnlyChainId)) {
    throw new Error('readOnlyChainId is not one of SupportedChainIds')
  }

  return readOnlyChainId
}
