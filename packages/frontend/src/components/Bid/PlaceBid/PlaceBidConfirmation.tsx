import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { BackButton } from 'src/components/Buttons/BackButton'
import { Button } from 'src/components/Buttons/Button'
import { Form } from 'src/components/Form/Form'
import styled from 'styled-components'

interface PlaceBidConfirmationProps {
  view: BidFlow
  setView: (state: BidFlow) => void
}

export const PlaceBidConfirmation = ({ view, setView }: PlaceBidConfirmationProps) => {
  return (
    <Wrapper>
      <ReviewForm
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <ReviewFormHeading>
          <BackButton view={view} setView={setView} />
          <h3>Place bid</h3>
        </ReviewFormHeading>
        <Button view="primary" onClick={() => setView(BidFlow.Placing)}>
          Back to home
        </Button>
      </ReviewForm>
    </Wrapper>
  )
}

const ReviewForm = styled(Form)`
  row-gap: 24px;
`
const ReviewFormHeading = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
`

const Wrapper = styled.div`
  display: flex;
  padding: 82px 115px;
  width: 100%;
`
