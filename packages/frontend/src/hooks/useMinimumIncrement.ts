import { BigNumber } from '@ethersproject/bignumber'
import { useCall } from '@usedapp/core'

import { useDevconContract } from './contract'

export function useMinimumIncrement() {
  const devconContract = useDevconContract()
  const { value, error } =
    useCall(
      devconContract && {
        contract: devconContract,
        method: 'minBidIncrement',
        args: [],
      }
    ) ?? {}
  const minimumIncrement = value ? value[0] : BigNumber.from(0)
  return { minimumIncrement, error }
}
