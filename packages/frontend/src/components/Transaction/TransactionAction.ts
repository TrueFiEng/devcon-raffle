import { TransactionStatus } from '@usedapp/core'
import { Transactions } from 'src/components/Transaction'

export interface TransactionAction {
  type: Transactions
  send: () => void
  state: TransactionStatus
  resetState: () => void
}
