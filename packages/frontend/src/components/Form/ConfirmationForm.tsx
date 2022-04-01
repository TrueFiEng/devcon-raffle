import { TxFlowSteps } from 'src/components/Bid/TxFlowSteps'
import { Form } from 'src/components/Form/Form'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { TransactionSuccess } from 'src/components/Transaction/TransactionSuccess'

interface ConfirmationFormProps {
  action: Transactions
  txHash: string
  setView: (state: TxFlowSteps) => void
}

export const ConfirmationForm = ({ action, txHash, setView }: ConfirmationFormProps) => {
  return (
    <Form>
      <TransactionSuccess action={action} txHash={txHash} setView={setView} />
    </Form>
  )
}
