import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useState } from 'react'
import { Button } from 'src/components/Buttons/Button'
import { BidFlow } from 'src/components/Bid/BidFlowEnum'
import { Form, FormHeading, FormRow } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'
import styled from 'styled-components'

interface BidProps {
  minimumBid: BigNumber
  bids: Bid[]
  setView: (state: BidFlow) => void
}

export const PlaceBidForm = ({ minimumBid, bids, setView }: BidProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const [bid, setBid] = useState(minimumBid)

  const notEnoughBalance = userBalance !== undefined && bid.gt(userBalance)
  const bidTooLow = bid.lt(minimumBid)

  return (
    <Wrapper>
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
        <Button disabled={notEnoughBalance || bidTooLow} onClick={() => setView(BidFlow.Review)}>Place bid</Button>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  width: 100%;
  padding: 82px 115px; 
`
