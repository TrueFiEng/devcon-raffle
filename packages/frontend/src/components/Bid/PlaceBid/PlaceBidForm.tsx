import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import React, { useMemo } from 'react'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { Button } from 'src/components/Buttons/Button'
import { Form, FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'

interface PlaceBidFormProps {
  bid: BigNumber
  setBid: (val: BigNumber) => void
  minimumBid: BigNumber
  bids: Bid[]
  setView: (state: BidFlowSteps) => void
}

export const PlaceBidForm = ({ bid, setBid, minimumBid, bids, setView }: PlaceBidFormProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const notEnoughBalance = userBalance !== undefined && bid.gt(userBalance)
  const bidTooLow = bid.lt(minimumBid)
  const positionAfterBid = useMemo(
    () => bids.findIndex((position) => position.amount.lt(bid)) + 1 || bids.length + 1,
    [bids, bid]
  )

  return (
    <FormWrapper>
      <FormHeading>Place bid</FormHeading>
      <Form>
        <FormRow>
          <span>Raffle price (min. bid)</span>
          <span>{formatEther(minimumBid)} ETH</span>
        </FormRow>
        <Input bid={bid} setBid={setBid} notEnoughBalance={notEnoughBalance} bidTooLow={bidTooLow} />
        <FormRow>
          <span>Your place in the raffle after the bid</span>
          <span>No. {positionAfterBid}</span>
        </FormRow>
        <Button
          disabled={notEnoughBalance || bidTooLow}
          onClick={() => {
            setView(BidFlowSteps.Review)
            account && bids.push({ bidderAddress: account, amount: bid })
          }}
        >
          Place bid
        </Button>
      </Form>
    </FormWrapper>
  )
}
