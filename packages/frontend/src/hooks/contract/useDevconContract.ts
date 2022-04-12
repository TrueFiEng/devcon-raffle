import { Devcon6, Devcon6__factory } from '@devcon-raffle/contracts'
import { useEthers } from '@usedapp/core'

import { useAddresses } from '../useAddresses'

export function useDevconContract(): Devcon6 | undefined {
  const devconAddress = useAddresses('devcon')
  const { library } = useEthers()

  if (!library || !devconAddress) {
    return undefined
  }
  return Devcon6__factory.connect(devconAddress.devcon, library)
}
