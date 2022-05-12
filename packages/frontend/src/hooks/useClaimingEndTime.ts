import moment from 'moment'
import { useMemo } from 'react'
import { useDevconParam } from 'src/hooks/useDevconParam'

export function useClaimingEndTime() {
  const { devconValue, error } = useDevconParam('claimingEndTime')

  const claimingEndTime = useMemo(() => {
    return devconValue ? moment.unix(devconValue.toNumber()).format('DD.MM.YYYY') : '--.--.----'
  }, [devconValue])

  return { claimingEndTime, error }
}
