import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { BackButton } from 'src/components/Buttons/BackButton'
import { FormWrapper, FormSubHeading } from 'src/components/Form/Form'
import { ReviewForm } from 'src/components/Form/ReviewForm'
import { TransactionAction, TransactionStepper, TransactionSuccess, Transactions } from 'src/components/Transaction'
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
  endInitialBidding?: () => void
}

export const AuctionTransaction = ({
  action,
  amount,
  impact,
  view,
  setView,
  endInitialBidding,
}: AuctionTransactionProps) => {
  const [txHash, setTxHash] = useState('')
  const isFailed = isTxFailed(action.state)

  return (
    <Transaction>
      <TransactionWrapper>
        <TransactionHeading>
          {view !== TxFlowSteps.Confirmation && (
            <BackButton view={view} setView={setView} resetState={action.resetState} />
          )}
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
          <TransactionSuccess
            action={action.type}
            txHash={txHash}
            setView={setView}
            endInitialBidding={endInitialBidding}
          />
        )}
      </TransactionWrapper>
      <TransactionStepper
        action={action.type}
        current={view === TxFlowSteps.Confirmation || isFailed ? 'Finalized' : `${heading[action.type]}`}
        isFailed={isFailed}
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
