import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
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
  bumpAmount: BigNumber
  minimumIncrement: BigNumber
  setBumpAmount: (val: BigNumber) => void
  setView: (state: TxFlowSteps) => void
  bids: BidWithPlace[]
}

export const BumpBidForm = ({
  userBid,
  newBid,
  bumpAmount,
  minimumIncrement,
  setBumpAmount,
  setView,
  bids,
}: BumpBidProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const notEnoughBalance = userBalance !== undefined && bumpAmount.gt(userBalance)
  const bidTooLow = bumpAmount.lt(minimumIncrement)

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
          <span>{formatEtherAmount(newBid)} ETH</span>
        </FormRow>
        <FormRow>
          <span>Place in the raffle after the bump</span>
          <span>No. {bidTooLow ? userBid.place : getPositionAfterBid(newBid, bids)}</span>
        </FormRow>
        <Button
          disabled={notEnoughBalance || bidTooLow}
          onClick={() => {
            setView(TxFlowSteps.Review)
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
