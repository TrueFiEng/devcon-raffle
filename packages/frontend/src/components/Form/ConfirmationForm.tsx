import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { Form } from 'src/components/Form/Form'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { TransactionSuccess } from 'src/components/Transaction/TransactionSuccess'

interface ConfirmationFormProps {
  action: Transactions
  txHash: string
  setView: (state: BidFlowSteps) => void
}

export const ConfirmationForm = ({ action, txHash, setView }: ConfirmationFormProps) => {
  return (
    <Form>
      <TransactionSuccess action={action} txHash={txHash} setView={setView} />
    </Form>
  )
}
