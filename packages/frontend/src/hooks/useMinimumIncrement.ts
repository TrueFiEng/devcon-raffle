import { ZERO } from 'src/constants/bigNumber'
import { useDevconParam } from 'src/hooks/useDevconParam'

export function useMinimumIncrement() {
  const { devconValue } = useDevconParam('minBidIncrement')
  return devconValue ? devconValue : ZERO
}
