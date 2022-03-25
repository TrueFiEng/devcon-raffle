import { BigNumber } from '@ethersproject/bignumber'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useEffect } from 'react'
import { heading } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { Button } from 'src/components/Buttons/Button'
import { FormRow, Form } from 'src/components/Form/Form'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { AuctionAction } from 'src/models/AuctionAction'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { isTxPending } from 'src/utils/transactions/isTxPending'

const amountLabel = {
  [Transactions.Place]: 'Your Bid',
  [Transactions.Bump]: 'Your Bid Bump',
  [Transactions.Withdraw]: 'Withdraw amount',
}

interface ReviewFormProps {
  action: AuctionAction
  amount: BigNumber
  impact?: BigNumber
  setTxHash: (hash: string) => void
  view: BidFlowSteps
  setView: (state: BidFlowSteps) => void
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
    }
  }, [view, setView, setTxHash, action.state])

  return (
    <Form>
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
        onClick={() => action.action()}
      >
        {heading[action.type]}
      </Button>
    </Form>
  )
}
