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
import type { BidWithPlace } from 'src/models/Bid'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { getPositionAfterBid } from 'src/utils/getPositionAfterBid'
import styled from 'styled-components'

interface BumpBidProps {
  userBid: BidWithPlace
  newBid: BigNumber
  setBid: (val: BigNumber) => void
  setView: (state: BidFlowSteps) => void
  bids: BidWithPlace[]
}

export const BumpBidForm = ({ userBid, newBid, setBid, setView, bids }: BumpBidProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const minimumIncrement = parseEther('0.01')
  const [bumpAmount, setBumpAmount] = useState(minimumIncrement)
  const notEnoughBalance = userBalance !== undefined && bumpAmount.gt(userBalance)
  const bidTooLow = bumpAmount.lt(minimumIncrement)
  const newBidAmount = newBid.add(bumpAmount)

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
          <span>No. {userBid.place}</span>
        </FormRow>
        <Input
          amount={bumpAmount}
          setAmount={setBumpAmount}
          notEnoughBalance={notEnoughBalance}
          bidTooLow={bidTooLow}
        />
        <FormRow>
          <span>Min. increment of the bid</span>
          <span>{formatEther(minimumIncrement)} ETH</span>
        </FormRow>
        <Separator />
        <FormRow>
          <span>Your bid after the bump</span>
          <span>{formatEtherAmount(newBidAmount)} ETH</span>
        </FormRow>
        <FormRow>
          <span>Place in the raffle after the bump</span>
          <span>No. {getPositionAfterBid(newBidAmount, bids)}</span>
        </FormRow>
        <Button
          disabled={notEnoughBalance || bidTooLow}
          onClick={() => {
            setView(BidFlowSteps.Review)
            setBid(newBid)
          }}
        >
          Bump your bid
        </Button>
      </BumpForm>
    </BumpFormWrapper>
  )
}

const BumpFormWrapper = styled(FormWrapper)`
  padding: 0 115px 0 170px;
  justify-content: center;
`

const BumpForm = styled(Form)`
  row-gap: 8px;
`
