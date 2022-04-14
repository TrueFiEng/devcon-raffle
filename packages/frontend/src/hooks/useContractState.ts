import { useCall } from '@usedapp/core'

import { useDevconContract } from './contract'

export enum ContractState {
  AWAITING_BIDDING,
  BIDDING_OPEN,
  BIDDING_CLOSED,
  AUCTION_SETTLED,
  RAFFLE_SETTLED,
  CLAIMING_CLOSED,
}

export function useContractState() {
  const devconContract = useDevconContract()
  const { value, error } =
    useCall({
      contract: devconContract,
      method: 'getState',
      args: [],
    }) ?? {}
  const state = value ? value[0] : ContractState.AWAITING_BIDDING
  return { state, error }
}
