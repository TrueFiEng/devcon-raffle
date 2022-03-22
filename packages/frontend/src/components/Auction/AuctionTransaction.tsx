import { BigNumber } from '@ethersproject/bignumber'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { BackButton } from 'src/components/Buttons/BackButton'
import { ConfirmationForm } from 'src/components/Form/ConfirmationForm'
import { FormWrapper, FormSubHeading } from 'src/components/Form/Form'
import { ReviewForm } from 'src/components/Form/ReviewForm'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { TransactionStepper } from 'src/components/Transaction/TransactionStepper'
import styled from 'styled-components'

export const heading = {
  [Transactions.Place]: 'Place bid',
  [Transactions.Bump]: 'Bump your Bid',
  [Transactions.Withdraw]: 'Withdraw',
}

interface AuctionTransactionProps {
  action: Transactions
  amount: BigNumber
  impact?: BigNumber
  view: BidFlow
  setView: (state: BidFlow) => void
}

export const AuctionTransaction = ({ action, amount, impact, view, setView }: AuctionTransactionProps) => {
  return (
    <Transaction>
      <TransactionWrapper>
        <TransactionHeading>
          <BackButton view={view} setView={setView} />
          <FormSubHeading>{heading[action]}</FormSubHeading>
        </TransactionHeading>
        {view === BidFlow.Review && (
          <ReviewForm action={action} amount={amount} impact={impact} view={view} setView={setView} />
        )}
        {view === BidFlow.Confirmation && <ConfirmationForm action={action} setView={setView} />}
      </TransactionWrapper>
      <TransactionStepper
        action={action}
        current={view === BidFlow.Confirmation ? 'Finalized' : `${heading[action]}`}
      />
    </Transaction>
  )
}

const Transaction = styled.div`
  display: flex;
  width: 100%;
`

const TransactionWrapper = styled(FormWrapper)`
  flex: 1;
  row-gap: 24px;
  padding: 82px 54px;
  width: fit-content;
`
const TransactionHeading = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
`
