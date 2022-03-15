import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useState } from 'react'
import { Form, FormHeading, FormRow } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'
import styled from 'styled-components'

interface BidProps {
  minimumBid: BigNumber
  bids: Bid[]
}

export const BidForm = ({ minimumBid, bids }: BidProps) => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)
  const [bid, setBid] = useState(minimumBid)
  const isBadAmount = etherBalance !== undefined && bid.lt(etherBalance)

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
        <Input bid={bid} setBid={setBid} isBadAmount={isBadAmount} />
        <FormRow>
          <span>Your place in the raffle after the bid</span>
          <span>No. -</span>
        </FormRow>
        <Button disabled={isBadAmount}>Place bid</Button>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-left: -170px;
  padding: 82px 115px;
  position: relative;
  z-index: 100;
  width: 724px;
  height: 450px;
  background: #6100ff;
`
const Button = styled.button`
  width: 250px;
  padding: 8px;
  font-size: 16px;
  line-height: 24px;
`
