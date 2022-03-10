import { useEthers } from '@usedapp/core'
import { useState } from 'react'
import { Form, FormRow, FormHeading } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'
import styled from 'styled-components'

interface BidProps {
  minimumBid: number
  bidList: Bid[]
}

export const BidForm = ({ minimumBid, bidList }: BidProps) => {
  const { account } = useEthers()
  const [bid, setBid] = useState(0)

  return (
    <Wrapper>
      <FormHeading>Place bid</FormHeading>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          account && bidList.push({ address: account, bid })
        }}
      >
        <FormRow>
          <span>Raffle price (min. bid)</span>
          <span>{minimumBid} ETH</span>
        </FormRow>
        <Input bid={bid} setBid={setBid} />
        <FormRow>
          <span>Your place in the raffle after the bid</span>
          <span>No. -</span>
        </FormRow>
        <Button>Place bid</Button>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-left: -137px;
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
