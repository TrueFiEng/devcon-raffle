import { useDevconParam } from './useDevconParam'

export function useRaffleWinnersCount() {
  const { devconValue } = useDevconParam('raffleWinnersCount')
  return devconValue ? devconValue.toNumber() : undefined
}
