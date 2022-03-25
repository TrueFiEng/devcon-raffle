import { TransactionStatus } from '@usedapp/core'
import { Transactions } from 'src/components/Transaction/TransactionEnum'

export interface TransactionAction {
  type: Transactions
  send: () => void
  state: TransactionStatus
}
