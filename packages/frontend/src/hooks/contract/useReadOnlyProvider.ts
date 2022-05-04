import { BaseProvider } from '@ethersproject/providers'
import { useReadonlyNetworks } from '@usedapp/core/internal'

import { useReadOnlyChainId } from '../chainId/useReadOnlyChainId'

export function useReadOnlyProvider(): BaseProvider {
  const providers = useReadonlyNetworks()
  const chainId = useReadOnlyChainId()
  const readOnlyProvider = providers[chainId]

  if (readOnlyProvider === undefined) {
    throw new Error('readOnlyProvider is not defined')
  }

  return readOnlyProvider
}
