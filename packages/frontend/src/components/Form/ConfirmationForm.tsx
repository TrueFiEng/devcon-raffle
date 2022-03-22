import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { Form } from 'src/components/Form/Form'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { TransactionSuccess } from 'src/components/Transaction/TransactionSuccess'

interface ConfirmationFormProps {
  action: Transactions
  setView: (state: BidFlow) => void
}

export const ConfirmationForm = ({ action, setView }: ConfirmationFormProps) => {
  const txHash = '0xD69bcE4E8D0929E16'
  return (
    <Form>
      <TransactionSuccess action={action} txHash={txHash} setView={setView} />
    </Form>
  )
}
