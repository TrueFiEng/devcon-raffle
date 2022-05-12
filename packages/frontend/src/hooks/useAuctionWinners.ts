import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'
import { useDevconContract } from 'src/hooks/contract'
import { useCachedCall } from 'src/hooks/useCachedCall'

export function useAuctionWinners() {
  const { devcon, chainId } = useDevconContract()
  const { value, error } =
    useCachedCall(
      {
        contract: devcon,
        method: 'getAuctionWinners',
        args: [],
      },
      chainId
    ) ?? {}

  const auctionWinners = useMemo(() => value && (value[0] as BigNumber[]), [value])
  return { auctionWinners, error }
}
