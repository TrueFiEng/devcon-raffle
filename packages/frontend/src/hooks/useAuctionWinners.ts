import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'

import { useDevconContract } from './contract'
import { useCachedCall } from './useCachedCall'

export function useAuctionWinners() {
  const devconContract = useDevconContract()
  const { value, error } = useCachedCall(
    devconContract && {
      contract: devconContract,
      method: 'getAuctionWinners',
      args: [],
    }
  ) ?? {}

  const devconValue = useMemo(() => value && value[0] as BigNumber[], [value])
  return { devconValue, error }
}
