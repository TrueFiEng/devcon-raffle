import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { BackButton } from 'src/components/Buttons/BackButton'
import { Button } from 'src/components/Buttons/Button'
import { Form, FormRow } from 'src/components/Form/Form'
import styled from 'styled-components'

interface PlaceBidReviewProps {
  bid: BigNumber
  view: BidFlow
  setView: (state: BidFlow) => void
}

export const PlaceBidReview = ({ bid, view, setView }: PlaceBidReviewProps) => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)

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
        <FormRow>
          <span>Your Bid</span>
          <span>{formatEther(bid)}</span>
        </FormRow>
        <FormRow>
          <span>Wallet Balace</span>
          <span>{etherBalance && formatEther(etherBalance)} ETH</span>
        </FormRow>
        <Button view="primary" onClick={() => setView(BidFlow.Confirmation)}>
          Place bid
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
