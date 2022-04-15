import { Devcon6, Devcon6__factory } from '@devcon-raffle/contracts'
import { useMemo } from 'react'

import { SupportedChainId } from '../../constants/chainIDs'
import { useChainId } from '../chainId/useChainId'
import { useAddresses } from '../useAddresses'

import { useProvider } from './useProvider'

interface UseDevconContractResult {
  devcon: Devcon6
  chainId: SupportedChainId
}

// This hook:
// - when wallet is not connected
//    - returns readonly provider connected to `readOnlyChainId` network
// - when wallet is connected
//   - when network not listed in `networks` is chosen
//    - returns readonly provider connected to `readOnlyChainId` network
//   - when network listed in `networks` is chosen
//    - returns injected provider connected to the chosen network
export function useDevconContract(): UseDevconContractResult {
  const chainId = useChainId()
  const { devcon } = useAddresses('devcon')
  const provider = useProvider()

  const devconContract = useMemo(() => Devcon6__factory.connect(devcon, provider), [devcon, provider])
  return {
    chainId,
    devcon: devconContract,
  }
}
