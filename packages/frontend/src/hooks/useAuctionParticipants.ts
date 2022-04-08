import { useDevconParam } from './useDevconParam'

export function useAuctionParticipants() {
  const { devconValue } = useDevconParam('auctionWinnersCount')
  return devconValue ? devconValue.toNumber() : 0
}
