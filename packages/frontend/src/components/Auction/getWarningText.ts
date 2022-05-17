import { ContractState } from 'src/hooks/useContractState'

export function getWarningText(state: ContractState) {
  if (state === ContractState.RAFFLE_SETTLED) {
    return {
      heading: 'Withdraw',
      action: 'withdraw funds',
    }
  }
  return {
    heading: 'Place bid',
    action: 'place a bid',
  }
}
