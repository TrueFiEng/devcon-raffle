import { useDevconParam } from 'src/hooks/useDevconParam'

export function useClaimingEndTime() {
  const { devconValue, error } = useDevconParam('claimingEndTime')

  return { claimingEndTime: devconValue, error }
}
