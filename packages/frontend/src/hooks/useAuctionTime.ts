import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

import { ContractState, useContractState } from './useContractState'
import { useDevconParam } from './useDevconParam'

export function useAuctionTime() {
  const { state } = useContractState()
  const method = state === ContractState.AWAITING_BIDDING ? 'biddingStartTime' : 'biddingEndTime'
  const { devconValue } = useDevconParam(method)

  return devconValue ? devconValue : BigNumber.from(moment().unix())
}
