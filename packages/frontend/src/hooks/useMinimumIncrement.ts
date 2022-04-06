import { BigNumber } from '@ethersproject/bignumber'

import { useDevconParam } from './useDevconParam'

export function useMinimumIncrement() {
  const { devconValue } = useDevconParam('minBidIncrement')
  const minimumIncrement = devconValue ? devconValue : BigNumber.from(0)
  return { minimumIncrement }
}
