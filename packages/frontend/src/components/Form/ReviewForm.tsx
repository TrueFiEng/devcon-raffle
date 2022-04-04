import { BigNumber } from '@ethersproject/bignumber'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useEffect } from 'react'
import { heading } from 'src/components/Auction/AuctionTransaction'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { Button } from 'src/components/Buttons/Button'
import { FormRow, FormNarrow } from 'src/components/Form/Form'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { isTxPending } from 'src/utils/transactions/isTxPending'

const amountLabel = {
  [Transactions.Place]: 'Your Bid',
  [Transactions.Bump]: 'Your Bid Bump',
  [Transactions.Withdraw]: 'Withdraw amount',
}

interface ReviewFormProps {
  action: TransactionAction
  amount: BigNumber
  impact?: BigNumber
  setTxHash: (hash: string) => void
  view: TxFlowSteps
  setView: (state: TxFlowSteps) => void
}

export const ReviewForm = ({ action, amount, impact, setTxHash, view, setView }: ReviewFormProps) => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)
  const isPending = isTxPending(action.state)

  useEffect(() => {
    if (action.state.status === 'Success') {
      if (!action.state.transaction) {
        return
      }
      setTxHash(action.state.transaction.hash)
      setView(view + 1)
      action.resetState()
    }
  }, [view, setView, setTxHash, action])

  return (
    <FormNarrow>
      <FormRow>
        <span>{amountLabel[action.type]}</span>
        <span>{formatEtherAmount(amount)} ETH</span>
      </FormRow>
      {impact && (
        <FormRow>
          <span>Your Bid after the bump</span>
          <span>{formatEtherAmount(impact)} ETH</span>
        </FormRow>
      )}
      <FormRow>
        <span>Wallet Balance</span>
        <span>{etherBalance && formatEtherAmount(etherBalance)} ETH</span>
      </FormRow>
      <Button
        view="primary"
        disabled={action.state.status !== 'None'}
        isLoading={isPending}
        onClick={() => action.send()}
      >
        {heading[action.type]}
      </Button>
    </FormNarrow>
  )
}
