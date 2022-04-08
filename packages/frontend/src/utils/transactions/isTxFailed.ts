import { TransactionStatus } from '@usedapp/core'

export function isTxFailed(state: TransactionStatus): boolean {
  return state.status === 'Fail' || state.status === 'Exception'
}
