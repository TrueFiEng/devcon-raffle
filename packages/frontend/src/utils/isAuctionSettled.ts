import { ContractState } from 'src/hooks/useContractState'

export function isAuctionSettled(state: ContractState) {
  return (
    state === ContractState.AUCTION_SETTLED ||
    state === ContractState.RAFFLE_SETTLED ||
    state === ContractState.CLAIMING_CLOSED
  )
}
