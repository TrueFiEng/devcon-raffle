import { useCall } from '@usedapp/core'
import { useDevconContract } from 'src/hooks/contract'

export enum ContractState {
  AWAITING_BIDDING,
  BIDDING_OPEN,
  BIDDING_CLOSED,
  AUCTION_SETTLED,
  RAFFLE_SETTLED,
  CLAIMING_CLOSED,
}

export function useContractState() {
  const { devcon, chainId } = useDevconContract()
  const { value, error } =
    useCall(
      {
        contract: devcon,
        method: 'getState',
        args: [],
      },
      { chainId }
    ) ?? {}
  const state = value ? value[0] : ContractState.AWAITING_BIDDING
  return { state, error, isLoading: value === undefined }
}
