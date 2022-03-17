import { Transactions } from 'src/components/Auction/AuctionEnum'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { Button } from 'src/components/Buttons/Button'
import { Form } from 'src/components/Form/Form'

const text = {
  [Transactions.Place]: 'placed bid',
  [Transactions.Bump]: 'bumped bid',
  [Transactions.Withdraw]: 'withdrawn',
}

interface ConfirmationFormProps {
  action: Transactions
  setView: (state: BidFlow) => void
}

export const ConfirmationForm = ({ action, setView }: ConfirmationFormProps) => {
  return (
    <Form>
      <p>You've successfully {text[action]}!</p>
      <Button view="primary" onClick={() => setView(0)}>
        Back to home
      </Button>
    </Form>
  )
}
