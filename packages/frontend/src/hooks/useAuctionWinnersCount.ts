import { useDevconParam } from './useDevconParam'

export function useAuctionWinnersCount() {
  const { devconValue } = useDevconParam('auctionWinnersCount')
  return devconValue ? devconValue.toNumber() : 0
}
