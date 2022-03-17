import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { Button } from 'src/components/Buttons/Button'
import { Form, FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'

interface PlaceBidFormProps {
  bid: BigNumber
  setBid: (val: BigNumber) => void
  minimumBid: BigNumber
  bids: Bid[]
  setView: (state: BidFlow) => void
}

export const PlaceBidForm = ({ bid, setBid, minimumBid, bids, setView }: PlaceBidFormProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const notEnoughBalance = userBalance !== undefined && bid.gt(userBalance)
  const bidTooLow = bid.lt(minimumBid)

  return (
    <FormWrapper>
      <FormHeading>Place bid</FormHeading>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          account && bids.push({ bidderAddress: account, amount: bid })
        }}
      >
        <FormRow>
          <span>Raffle price (min. bid)</span>
          <span>{formatEther(minimumBid)} ETH</span>
        </FormRow>
        <Input bid={bid} setBid={setBid} notEnoughBalance={notEnoughBalance} bidTooLow={bidTooLow} />
        <FormRow>
          <span>Your place in the raffle after the bid</span>
          <span>No. -</span>
        </FormRow>
        <Button disabled={notEnoughBalance || bidTooLow} onClick={() => setView(BidFlow.Review)}>
          Place bid
        </Button>
      </Form>
    </FormWrapper>
  )
}
