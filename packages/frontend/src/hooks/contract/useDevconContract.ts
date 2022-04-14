import { Devcon6, Devcon6__factory } from '@devcon-raffle/contracts'

import { useAddresses } from '../useAddresses'

import { useProvider } from './useProvider'

// This hook:
// - when wallet is not connected
//    - returns readonly provider connected to `readOnlyChainId` network
// - when wallet is connected
//   - when network not listed in `networks` is chosen
//    - returns readonly provider connected to `readOnlyChainId` network
//   - when network listed in `networks` is chosen
//    - returns injected provider connected to the chosen network
export function useDevconContract(): Devcon6 {
  const { devcon } = useAddresses('devcon')
  const provider = useProvider()
  return Devcon6__factory.connect(devcon, provider)
}
