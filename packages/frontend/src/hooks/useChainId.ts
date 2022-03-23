import { ChainId, useEthers } from '@usedapp/core'

export function useChainId() {
  const { chainId = ChainId.Arbitrum } = useEthers()

  return chainId
}
