import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

import { useContractState, ContractState } from './useContractState'
import { useDevconParam } from './useDevconParam'

export function useAuctionTime() {
  const { state } = useContractState()
  const method = state === ContractState.AWAITING_BIDDING ? 'biddingStartTime' : 'biddingEndTime'
  const { devconValue } = useDevconParam(method)

  const timestamp = devconValue ? devconValue : BigNumber.from(moment().unix())
  return { timestamp }
}
