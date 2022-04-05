import { useCall } from '@usedapp/core'
import moment from 'moment'

import { useDevconContract } from './contract'

export function useClaimingEndTime() {
  const devconContract = useDevconContract()

  const { value, error } =
    useCall(
      devconContract && {
        contract: devconContract,
        method: 'claimingEndTime',
        args: [],
      }
    ) ?? {}
  const claimingEndTime = value && moment.unix(value[0].toNumber()).format('DD.MM.YYYY')
  return { claimingEndTime, error }
}
