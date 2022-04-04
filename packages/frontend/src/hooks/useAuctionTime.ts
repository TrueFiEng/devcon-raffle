import { BigNumber } from '@ethersproject/bignumber'
import { useCall } from '@usedapp/core'
import moment from 'moment'

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
  const timestamp = value !== undefined ? value[0] : BigNumber.from(moment().unix())
  return { timestamp, error }
}
