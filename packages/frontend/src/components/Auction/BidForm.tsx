import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useState } from 'react'
import { Button } from 'src/components/Buttons/Button'
import { Form, FormHeading, FormRow } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface BidProps {
  minimumBid: BigNumber
  bids: Bid[]
}

export const BidForm = ({ minimumBid, bids }: BidProps) => {
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
        <Button disabled={notEnoughBalance || bidTooLow}>Place bid</Button>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  width: 724px;
  height: 450px;
  margin-left: -170px;
  padding: 82px 115px;
  position: relative;
  background-color: ${Colors.Blue};
  z-index: 100;
`
