import { TransactionStatus } from '@usedapp/core'

export function isTxPending(state: TransactionStatus): boolean {
  return state.status === 'Mining' || state.status === 'PendingSignature'
}
