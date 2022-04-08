import { useDevconParam } from './useDevconParam'

export function useRaffleParticipants() {
  const { devconValue } = useDevconParam('raffleWinnersCount')
  return devconValue ? devconValue.toNumber() : 0
}
