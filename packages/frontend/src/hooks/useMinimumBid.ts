import { BigNumber } from '@ethersproject/bignumber'

import { useDevconParam } from './useDevconParam'

export function useMinimumBid() {
  const { devconValue } = useDevconParam('reservePrice')
  const minimumBid = devconValue ? devconValue : BigNumber.from(0)
  return { minimumBid }
}
