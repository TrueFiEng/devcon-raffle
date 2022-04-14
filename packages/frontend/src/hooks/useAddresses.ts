import { useMemo } from 'react'
import { CONFIG } from 'src/config/config'
import { useChainId } from 'src/hooks/chainId/useChainId'

export type Contract = keyof typeof CONFIG.addresses

export function useAddresses<C extends Contract>(...contracts: readonly C[]): Record<C, string> {
  const chainId = useChainId()

  return useMemo(() => {
    const entries = contracts.map((contract) => [contract, CONFIG.addresses[contract][chainId]])
    return Object.fromEntries(entries)
  }, [chainId, contracts])
}
