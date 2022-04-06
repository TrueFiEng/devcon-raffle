import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'

import { useContractState, ContractState } from './useContractState'
import { useDevconParam } from './useDevconParam'

export function useAuctionTime() {
  const { state } = useContractState()
  const getTime = state === ContractState.AWAITING_BIDDING ? 'biddingStartTime' : 'biddingEndTime'
  const { devconValue } = useDevconParam(getTime)

  const timestamp = devconValue ? devconValue : BigNumber.from(moment().unix())
  return { timestamp }
}
