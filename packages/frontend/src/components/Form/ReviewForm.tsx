import { BigNumber } from '@ethersproject/bignumber'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useEffect } from 'react'
import { heading } from 'src/components/Auction/AuctionTransaction'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { Button } from 'src/components/Buttons/Button'
import { FormRow, Form } from 'src/components/Form/Form'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { useBid } from 'src/hooks/transactions/useBid'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { isTxPending } from 'src/utils/transactions/isTxPending'

const amountLabel = {
  [Transactions.Place]: 'Your Bid',
  [Transactions.Bump]: 'Your Bid Bump',
  [Transactions.Withdraw]: 'Withdraw amount',
}

interface ReviewFormProps {
  action: Transactions
  amount: BigNumber
  impact?: BigNumber
  setTxHash: (hash: string) => void
  view: BidFlowSteps
  setView: (state: BidFlowSteps) => void
}

export const ReviewForm = ({ action, amount, impact, setTxHash, view, setView }: ReviewFormProps) => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)
  const { placeBid, state } = useBid()
  const isPending = isTxPending(state)

  useEffect(() => {
    if (state.status === 'Success') {
      if (!state.transaction) {
        return
      }
      setTxHash(state.transaction.hash)
      setView(view + 1)
    }
  }, [view, setView, setTxHash, state])

  return (
    <Form>
      <FormRow>
        <span>{amountLabel[action]}</span>
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
      <Button view="primary" disabled={state.status !== 'None'} isLoading={isPending} onClick={() => placeBid(amount)}>
        {heading[action]}
      </Button>
    </Form>
  )
}
