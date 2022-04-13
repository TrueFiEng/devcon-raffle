import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'

import { useDevconContract } from './contract'
import { useCachedCall } from './useCachedCall'

export function useRaffleWinners() {
  const devconContract = useDevconContract()
  const { value, error } =
    useCachedCall(
      devconContract && {
        contract: devconContract,
        method: 'getRaffleWinners',
        args: [],
      }
    ) ?? {}

  const raffleWinners = useMemo(() => value && (value[0] as BigNumber[]), [value])
  return { raffleWinners, error }
}
