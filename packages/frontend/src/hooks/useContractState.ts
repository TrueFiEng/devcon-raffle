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
    useCall(
      devconContract && {
        contract: devconContract,
        method: 'getState',
        args: [],
      }
    ) ?? {}
  const state: ContractState | undefined = value && value[0]
  return { state, error }
}
