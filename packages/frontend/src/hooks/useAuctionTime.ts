import { ContractState, useContractState } from 'src/hooks/useContractState'
import { useDevconParam } from 'src/hooks/useDevconParam'

export function useAuctionTime() {
  const { state } = useContractState()
  const method = state === ContractState.AWAITING_BIDDING ? 'biddingStartTime' : 'biddingEndTime'
  const { devconValue } = useDevconParam(method)

  return devconValue
}
