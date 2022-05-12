import { ZERO } from 'src/constants/bigNumber'
import { useDevconParam } from 'src/hooks/useDevconParam'

export function useMinimumBid() {
  const { devconValue } = useDevconParam('reservePrice')
  return devconValue ? devconValue : ZERO
}
