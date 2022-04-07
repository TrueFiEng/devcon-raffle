import { useMemo } from 'react'
import { CONFIG } from 'src/config/config'
import { isSupportedChain } from 'src/constants/chainIDs'
import { useChainId } from 'src/hooks/useChainId'

export type Contract = keyof typeof CONFIG.addresses

export function useAddresses<SelectedContract extends Contract>(
  ...contracts: readonly SelectedContract[]
): Record<SelectedContract, string> {
  const chainId = useChainId()

  return useMemo(() => {
    if (!isSupportedChain(chainId)) {
      return
    }

    const entries = contracts.map((contract) => [contract, CONFIG.addresses[contract][chainId]])
    return Object.fromEntries(entries)
  }, [chainId, contracts])
}
