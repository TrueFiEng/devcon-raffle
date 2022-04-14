import { ChainId, useConfig, useEthers } from '@usedapp/core'

export function useChainId() {
  const { readOnlyChainId } = useConfig()
  const { chainId = readOnlyChainId ?? ChainId.Arbitrum } = useEthers()

  return chainId
}
