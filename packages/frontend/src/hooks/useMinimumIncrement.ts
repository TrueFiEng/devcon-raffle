import { BigNumber } from '@ethersproject/bignumber'

import { useDevconParam } from './useDevconParam'

export function useMinimumIncrement() {
  const { devconValue } = useDevconParam('minBidIncrement')
  return devconValue ? devconValue : BigNumber.from(0)
}
