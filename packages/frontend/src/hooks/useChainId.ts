import { ChainId, useEthers } from '@usedapp/core'

export function useChainId() {
  const { chainId = ChainId.Mainnet } = useEthers()

  return chainId
}
