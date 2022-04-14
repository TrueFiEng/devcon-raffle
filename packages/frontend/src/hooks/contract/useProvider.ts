import { Provider } from '@ethersproject/providers'
import { useEthers } from '@usedapp/core'
import { useReadonlyNetworks } from '@usedapp/core/internal'
import { useReadOnlyChainId } from 'src/hooks/chainId/useReadOnlyChainId'

export function useProvider(): Provider {
  const { library: injectedProvider, error } = useEthers()

  const providers = useReadonlyNetworks()
  const chainId = useReadOnlyChainId()
  const readOnlyProvider = providers[chainId]

  if (readOnlyProvider === undefined) {
    throw new Error('readOnlyProvider is not defined')
  }

  if (error !== undefined) {
    return readOnlyProvider
  }

  return injectedProvider ?? readOnlyProvider
}
