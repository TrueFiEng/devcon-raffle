import { TransactionStatus } from '@usedapp/core'
import { Transactions } from 'src/components/Transaction/TransactionEnum'

export interface AuctionAction {
  type: Transactions
  action: () => void
  state: TransactionStatus
}
