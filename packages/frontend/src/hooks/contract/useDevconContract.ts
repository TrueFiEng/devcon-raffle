import { Devcon6, Devcon6__factory } from '@devcon-raffle/contracts'
import { useEthers } from '@usedapp/core'

import { useAddresses } from '../useAddresses'

export function useDevconContract(): Devcon6 | undefined {
  const { devcon } = useAddresses('devcon')
  const { library } = useEthers()

  if (!library) {
    return undefined
  }
  return Devcon6__factory.connect(devcon, library)
}
