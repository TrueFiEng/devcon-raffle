import { ZERO } from '../constants/bigNumber'

import { useDevconParam } from './useDevconParam'

export function useMinimumBid() {
  const { devconValue } = useDevconParam('reservePrice')
  return devconValue ? devconValue : ZERO
}
