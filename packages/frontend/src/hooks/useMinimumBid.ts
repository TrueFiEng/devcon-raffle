import { BigNumber } from '@ethersproject/bignumber'
import { useCall } from '@usedapp/core'

import { useDevconContract } from './contract'

export function useMinimumBid() {
  const devconContract = useDevconContract()
  const { value, error } =
    useCall(
      devconContract && {
        contract: devconContract,
        method: 'reservePrice',
        args: [],
      }
    ) ?? {}
  const minimumBid = value ? value[0] : BigNumber.from(0)
  return { minimumBid, error }
}
