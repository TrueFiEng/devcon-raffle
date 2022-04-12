import { Devcon6, Devcon6__factory } from '@devcon-raffle/contracts'
import { useEthers } from '@usedapp/core'
import { useMemo } from 'react'

import { useAddresses } from '../useAddresses'

export function useDevconContract(): Devcon6 | undefined {
  const { devcon } = useAddresses('devcon')
  const { library } = useEthers()

  return useMemo(() => library && Devcon6__factory.connect(devcon, library), [devcon, library])
}
