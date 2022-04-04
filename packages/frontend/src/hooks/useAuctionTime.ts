import { BigNumber } from '@ethersproject/bignumber'
import { useCall } from '@usedapp/core'

import { useDevconContract } from './contract'
import { useContractState, ContractState } from './useContractState'

export function useAuctionTime() {
  const devconContract = useDevconContract()
  const { state } = useContractState()
  const getTime = state === ContractState.AWAITING_BIDDING ? 'biddingStartTime' : 'biddingEndTime'

  const { value, error } =
    useCall(
      devconContract && {
        contract: devconContract,
        method: getTime,
        args: [],
      }
    ) ?? {}
  const timestamp = value !== undefined ? value[0] : BigNumber.from(0)
  return { timestamp, error }
}
