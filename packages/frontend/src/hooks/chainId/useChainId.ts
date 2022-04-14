import { SupportedChainId } from '../../constants/chainIDs'

import { useInjectedProviderChainId } from './useInjectedProviderChainId'
import { useReadOnlyChainId } from './useReadOnlyChainId'

export function useChainId(): SupportedChainId {
  const injectedChainId = useInjectedProviderChainId()
  const readOnlyChainId = useReadOnlyChainId()
  return injectedChainId ?? readOnlyChainId
}
