import { useDevconParam } from 'src/hooks/useDevconParam'

export function useAuctionWinnersCount() {
  const { devconValue } = useDevconParam('auctionWinnersCount')
  return devconValue ? devconValue.toNumber() : undefined
}
