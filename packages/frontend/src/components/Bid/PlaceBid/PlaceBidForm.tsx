import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { Button } from 'src/components/Buttons/Button'
import { Form, FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'
import { getPositionAfterBid } from 'src/utils/getPositionAfterBid'

interface PlaceBidFormProps {
  bid: string
  setBid: (val: string) => void
  minimumBid: BigNumber
  bids: Bid[]
  setView: (state: TxFlowSteps) => void
}

export const PlaceBidForm = ({ bid, setBid, minimumBid, bids, setView }: PlaceBidFormProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const parsedBid = useMemo(() => parseEther(bid == '' ? '0' : bid), [bid])
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
