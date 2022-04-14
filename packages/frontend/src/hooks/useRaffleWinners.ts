import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'

import { useDevconContract } from './contract'
import { useCachedCall } from './useCachedCall'

export function useRaffleWinners() {
  const { devcon, chainId } = useDevconContract()
  const { value, error } =
    useCachedCall(
      {
        contract: devcon,
        method: 'getRaffleWinners',
        args: [],
      },
      chainId
    ) ?? {}

  const raffleWinners = useMemo(() => value && (value[0] as BigNumber[]), [value])
  return { raffleWinners, error }
}
