import { Devcon6, Devcon6__factory } from '@devcon-raffle/contracts'
import { useEthers } from '@usedapp/core'

import { useAddresses } from '../useAddresses'

export function useDevconContract(): Devcon6 {
  const { devcon } = useAddresses('devcon')
  const { library } = useEthers()

  if (!library) {
    throw new Error('library not found')
  }
  return Devcon6__factory.connect(devcon, library)
}
