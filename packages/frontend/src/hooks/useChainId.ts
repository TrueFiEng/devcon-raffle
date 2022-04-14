import { useConfig, useEthers } from '@usedapp/core'

export function useChainId() {
  const { readOnlyChainId } = useConfig()
  const { chainId = readOnlyChainId } = useEthers()

  return chainId
}
