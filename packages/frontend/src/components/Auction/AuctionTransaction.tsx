import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { BackButton } from 'src/components/Buttons/BackButton'
import { ConfirmationForm } from 'src/components/Form/ConfirmationForm'
import { FormWrapper, FormSubHeading } from 'src/components/Form/Form'
import { ReviewForm } from 'src/components/Form/ReviewForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { TransactionStepper } from 'src/components/Transaction/TransactionStepper'
import styled from 'styled-components'

export const heading = {
  [Transactions.Place]: 'Place bid',
  [Transactions.Bump]: 'Bump your Bid',
  [Transactions.Withdraw]: 'Withdraw',
}

interface AuctionTransactionProps {
  action: TransactionAction
  amount: BigNumber
  impact?: BigNumber
  view: BidFlowSteps
  setView: (state: BidFlowSteps) => void
}

export const AuctionTransaction = ({ action, amount, impact, view, setView }: AuctionTransactionProps) => {
  const [txHash, setTxHash] = useState('')

  return (
    <Transaction>
      <TransactionWrapper>
        <TransactionHeading>
          <BackButton view={view} setView={setView} />
          <FormSubHeading>{heading[action.type]}</FormSubHeading>
        </TransactionHeading>
        {view === BidFlowSteps.Review && (
          <ReviewForm
            action={action}
            amount={amount}
            impact={impact}
            setTxHash={setTxHash}
            view={view}
            setView={setView}
          />
        )}
        {view === BidFlowSteps.Confirmation && (
          <ConfirmationForm action={action.type} txHash={txHash} setView={setView} />
        )}
      </TransactionWrapper>
      <TransactionStepper
        action={action.type}
        current={view === BidFlowSteps.Confirmation ? 'Finalized' : `${heading[action.type]}`}
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
