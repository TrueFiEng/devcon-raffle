import { BaseProvider } from '@ethersproject/providers'
import { useEthers } from '@usedapp/core'

import { useReadOnlyProvider } from './useReadOnlyProvider'

export function useProvider(): BaseProvider {
  const { library: injectedProvider, error } = useEthers()
  const readOnlyProvider = useReadOnlyProvider()

  if (error !== undefined) {
    return readOnlyProvider
  }

  return injectedProvider ?? readOnlyProvider
}
