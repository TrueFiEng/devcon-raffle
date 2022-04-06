import { BigNumber } from '@ethersproject/bignumber'

import { useDevconParam } from './useDevconParam'

export function useMinimumBid() {
  const { devconValue } = useDevconParam('reservePrice')
  return devconValue ? devconValue : BigNumber.from(0)
}
