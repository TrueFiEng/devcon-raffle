import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { Button } from 'src/components/Buttons/Button'
import { Separator } from 'src/components/common/Separator'
import { Form, FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { Input } from 'src/components/Form/Input'
import type { Bid } from 'src/models/Bid'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { getPositionAfterBump } from 'src/utils/getPositionAfterBump'
import styled from 'styled-components'

interface BumpBidProps {
  userBid: Bid
  newBidAmount: BigNumber
  bumpAmount: string
  parsedBumpAmount: BigNumber
  minimumIncrement: BigNumber
  setBumpAmount: (val: string) => void
  setView: (state: TxFlowSteps) => void
  bids: Bid[]
}

export const BumpBidForm = ({
  userBid,
  newBidAmount,
  bumpAmount,
  parsedBumpAmount,
  minimumIncrement,
  setBumpAmount,
  setView,
  bids,
}: BumpBidProps) => {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const notEnoughBalance = userBalance !== undefined && parsedBumpAmount.gt(userBalance)
  const bidTooLow = parsedBumpAmount.lt(minimumIncrement)

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
          initialAmount={bumpAmount}
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
          <span>No. {bidTooLow ? userBid.place : getPositionAfterBump(newBidAmount, userBid.bidderID, bids)}</span>
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
