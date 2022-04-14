import { Provider } from '@ethersproject/providers'
import { useEthers } from '@usedapp/core'
import { useReadonlyNetwork } from '@usedapp/core/dist/cjs/src/hooks'
import { useReadOnlyChainId } from 'src/hooks/chainId/useReadOnlyChainId'

export function useProvider(): Provider {
  const { library: injectedProvider, error } = useEthers()

  const chainId = useReadOnlyChainId()
  const { provider: readOnlyProvider } = useReadonlyNetwork({chainId}) ?? {}

  if (readOnlyProvider === undefined) {
    throw new Error('readOnlyProvider is not defined')
  }

  if (error !== undefined) {
    return readOnlyProvider
  }

  return injectedProvider ?? readOnlyProvider
}
