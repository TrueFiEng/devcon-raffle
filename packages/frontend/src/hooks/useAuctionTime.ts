import { BigNumber } from '@ethersproject/bignumber'
import { useCall } from '@usedapp/core'

import { useDevconContract } from './contract'

export function useAuctionTime() {
  const devconContract = useDevconContract()
  const { value, error } =
    useCall({
      contract: devconContract as any,
      method: 'biddingStartTime',
      args: [],
    }) ?? {}
  return { value: value as BigNumber, error }
}
