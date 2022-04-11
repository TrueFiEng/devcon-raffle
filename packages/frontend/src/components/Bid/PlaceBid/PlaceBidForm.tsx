import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { Button } from 'src/components/Buttons/Button'
import { Form, FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'
import { getPositionAfterBid } from 'src/utils/getPositionAfterBid'

interface PlaceBidFormProps {
  bid: BigNumber
  setBid: (val: BigNumber) => void
  minimumBid: BigNumber
  bids: Bid[]
  setView: (state: TxFlowSteps) => void
}

export const PlaceBidForm = ({ bid, setBid, minimumBid, bids, setView }: PlaceBidFormProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const notEnoughBalance = userBalance !== undefined && bid.gt(userBalance)
  const bidTooLow = bid.lt(minimumBid)

  return (
    <FormWrapper>
      <FormHeading>Place bid</FormHeading>
      <Form>
        <FormRow>
          <span>Raffle price (min. bid)</span>
          <span>{formatEther(minimumBid)} ETH</span>
        </FormRow>
        <Input
          initialAmount={minimumBid}
          setAmount={setBid}
          notEnoughBalance={notEnoughBalance}
          bidTooLow={bidTooLow}
        />
        <FormRow>
          <span>Your place in the raffle after the bid</span>
          <span>No. {getPositionAfterBid(bid, bids)}</span>
        </FormRow>
        <Button disabled={notEnoughBalance || bidTooLow} onClick={() => setView(TxFlowSteps.Review)}>
          Place bid
        </Button>
      </Form>
    </FormWrapper>
  )
}
