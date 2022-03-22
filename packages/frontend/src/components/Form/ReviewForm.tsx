import { BigNumber } from '@ethersproject/bignumber'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { heading } from 'src/components/Auction/AuctionTransaction'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { Button } from 'src/components/Buttons/Button'
import { FormRow, Form } from 'src/components/Form/Form'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'

const amountLabel = {
  [Transactions.Place]: 'Your Bid',
  [Transactions.Bump]: 'Your Bump Bid',
  [Transactions.Withdraw]: 'Withdraw amount',
}

interface ReviewFormProps {
  action: Transactions
  amount: BigNumber
  impact?: BigNumber
  view: BidFlow
  setView: (state: BidFlow) => void
}

export const ReviewForm = ({ action, amount, impact, view, setView }: ReviewFormProps) => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)

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
        <span>Wallet Balace</span>
        <span>{etherBalance && formatEtherAmount(etherBalance)} ETH</span>
      </FormRow>
      <Button view="primary" onClick={() => setView(view + 1)}>
        {heading[action]}
      </Button>
    </Form>
  )
}
