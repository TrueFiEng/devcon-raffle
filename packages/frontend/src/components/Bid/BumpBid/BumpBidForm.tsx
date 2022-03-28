import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { parseEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { useState } from 'react'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { Button } from 'src/components/Buttons/Button'
import { Separator } from 'src/components/common/Separator'
import { Form, FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import { Bid } from 'src/models/Bid'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import styled from 'styled-components'

interface BumpBidProps {
  userBid: Bid
  newBid: BigNumber
  setBid: (val: BigNumber) => void
  setView: (state: BidFlowSteps) => void
}

export const BumpBidForm = ({ userBid, newBid, setBid, setView }: BumpBidProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const minimumIncrement = parseEther('0.01')
  const [bumpAmount, setBumpAmount] = useState(minimumIncrement)
  const notEnoughBalance = userBalance !== undefined && bumpAmount.gt(userBalance)
  const bidTooLow = bumpAmount.lt(minimumIncrement)

  const updateBid = () => {
    setBid(userBid.amount.add(bumpAmount))
    userBid.amount = newBid
  }

  return (
    <BumpFormWrapper>
      <FormHeading>Bump your bid</FormHeading>
      <BumpForm>
        <FormRow>
          <span>Your current bid</span>
          <span>{formatEtherAmount(userBid.amount)} ETH</span>
        </FormRow>
        <FormRow>
          <span>Current place in the raffle</span>
          <span>No. -</span>
        </FormRow>
        <Input bid={bumpAmount} setBid={setBumpAmount} notEnoughBalance={notEnoughBalance} bidTooLow={bidTooLow} />
        <FormRow>
          <span>Min. increment of the bid</span>
          <span>{formatEther(minimumIncrement)} ETH</span>
        </FormRow>
        <Separator />
        <FormRow>
          <span>Your bid after the bump</span>
          <span>{formatEtherAmount(userBid.amount.add(bumpAmount))} ETH</span>
        </FormRow>
        <FormRow>
          <span>Place in the raffle after the bump</span>
          <span>No. -</span>
        </FormRow>
        <Button
          disabled={notEnoughBalance || bidTooLow}
          onClick={() => {
            setView(BidFlowSteps.Review)
            updateBid()
          }}
        >
          Bump your bid
        </Button>
      </BumpForm>
    </BumpFormWrapper>
  )
}

const BumpFormWrapper = styled(FormWrapper)`
  padding: 0 115px;
  justify-content: center;
`

const BumpForm = styled(Form)`
  row-gap: 8px;
`
