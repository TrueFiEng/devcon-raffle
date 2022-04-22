import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { Button } from 'src/components/Buttons'
import { Input } from 'src/components/Form'
import { Form, FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { Bid } from 'src/models/Bid'
import { getPositionAfterBid } from 'src/utils/getPositionAfterBid'

interface PlaceBidFormProps {
  bid: string
  parsedBid: BigNumber
  setBid: (val: string) => void
  minimumBid: BigNumber
  bids: Bid[]
  setView: (state: TxFlowSteps) => void
}

export const PlaceBidForm = ({ bid, parsedBid, setBid, minimumBid, bids, setView }: PlaceBidFormProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const notEnoughBalance = userBalance !== undefined && parsedBid.gt(userBalance)
  const bidTooLow = parsedBid.lt(minimumBid)

  return (
    <FormWrapper>
      <FormHeading>Place bid</FormHeading>
      <Form>
        <FormRow>
          <span>Raffle price (min. bid)</span>
          <span>{formatEther(minimumBid)} ETH</span>
        </FormRow>
        <Input initialAmount={bid} setAmount={setBid} notEnoughBalance={notEnoughBalance} bidTooLow={bidTooLow} />
        <FormRow>
          <span>Your place in the raffle after the bid</span>
          <span>No. {getPositionAfterBid(parsedBid, bids)}</span>
        </FormRow>
        <Button disabled={notEnoughBalance || bidTooLow} onClick={() => setView(TxFlowSteps.Review)}>
          Place bid
        </Button>
      </Form>
    </FormWrapper>
  )
}
