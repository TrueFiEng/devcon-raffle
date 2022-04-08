import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { BackButton } from 'src/components/Buttons/BackButton'
import { FormWrapper, FormSubHeading } from 'src/components/Form/Form'
import { ReviewForm } from 'src/components/Form/ReviewForm'
import { TransactionAction } from 'src/components/Transaction/TransactionAction'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { TransactionStepper } from 'src/components/Transaction/TransactionStepper'
import { TransactionSuccess } from 'src/components/Transaction/TransactionSuccess'
import { isTxFailed } from 'src/utils/transactions/isTxFailed'
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
  view: TxFlowSteps
  setView: (state: TxFlowSteps) => void
}

export const AuctionTransaction = ({ action, amount, impact, view, setView }: AuctionTransactionProps) => {
  const [txHash, setTxHash] = useState('')
  const IsFailed = isTxFailed(action.state)

  return (
    <Transaction>
      <TransactionWrapper>
        <TransactionHeading>
          {view !== TxFlowSteps.Confirmation && <BackButton view={view} setView={setView} />}
          <FormSubHeading>{heading[action.type]}</FormSubHeading>
        </TransactionHeading>
        {view === TxFlowSteps.Review && (
          <ReviewForm
            action={action}
            amount={amount}
            impact={impact}
            setTxHash={setTxHash}
            view={view}
            setView={setView}
          />
        )}
        {view === TxFlowSteps.Confirmation && (
          <TransactionSuccess action={action.type} txHash={txHash} setView={setView} />
        )}
      </TransactionWrapper>
      <TransactionStepper
        action={action}
        current={view === TxFlowSteps.Confirmation || IsFailed ? 'Finalized' : `${heading[action.type]}`}
        IsFailed={IsFailed}
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
