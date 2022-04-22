import { useDevconParam } from 'src/hooks/useDevconParam'

export function useRaffleWinnersCount() {
  const { devconValue } = useDevconParam('raffleWinnersCount')
  return devconValue ? devconValue.toNumber() : undefined
}
