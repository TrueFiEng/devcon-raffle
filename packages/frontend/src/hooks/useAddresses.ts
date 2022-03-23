import { useMemo } from 'react'
import { ADDRESSES } from 'src/constants/addresses'

import { useChainId } from './useChainId'

export type Contract = keyof typeof ADDRESSES

export function useAddresses<SelectedContract extends Contract>(
  ...contracts: readonly SelectedContract[]
): Record<SelectedContract, string> {
  const chainId = useChainId()

  return useMemo(() => {
    const entries = contracts.map((contract) => [contract, ADDRESSES[contract][chainId]])
    return Object.fromEntries(entries)
  }, [chainId, contracts])
}
