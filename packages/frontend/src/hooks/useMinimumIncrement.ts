import { ZERO } from '../constants/bigNumber'

import { useDevconParam } from './useDevconParam'

export function useMinimumIncrement() {
  const { devconValue } = useDevconParam('minBidIncrement')
  return devconValue ? devconValue : ZERO
}
