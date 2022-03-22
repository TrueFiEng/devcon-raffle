import { BigNumber } from '@ethersproject/bignumber'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { WinOptions } from 'src/components/Bid/WinBid/WinFlowEnum'
import { Button } from 'src/components/Buttons/Button'
import { FormWrapper, FormHeading } from 'src/components/Form/Form'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import styled from 'styled-components'

const winText = {
  [WinOptions.Ticket]: 'You won the Golden Ticket!',
  [WinOptions.Auction]: 'You bid was in the top 20, so you win a free ticket to Devcon 6!',
  [WinOptions.Raffle]: 'You were chosen in the raffle!',
}

const withdrawText = {
  [WinOptions.Ticket]: 'This means your ticket is free, so you can withdraw all your funds.',
  [WinOptions.Raffle]: 'This means that you can withdraw all funds you bid over the reserve price.',
}

interface WinBidFormProps {
  win: WinOptions
  bid: BigNumber
  setView: (state: BidFlowSteps) => void
}

export const WinBidForm = ({ win, bid, setView }: WinBidFormProps) => {
  return (
    <WinFormWrapper>
      <FormHeading>Congratulations 🎉</FormHeading>
      <WinText>{winText[win]}</WinText>
      {win !== WinOptions.Auction && (
        <WinOption>
          <span>{withdrawText[win]}</span>
          <Button view="primary" onClick={() => setView(BidFlowSteps.Review)}>
            <span>Withdraw {formatEtherAmount(bid)} ETH</span>
          </Button>
        </WinOption>
      )}
      <WinOption>
        <span>Get your voucher code</span>
        <Button view="primary">Get voucher code</Button>
      </WinOption>
    </WinFormWrapper>
  )
}

const WinFormWrapper = styled(FormWrapper)`
  justify-content: center;
`
const WinText = styled.p`
  color: ${Colors.White};
  max-width: 365px;
`

const WinOption = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  max-width: 365px;
  color: ${Colors.White};
`
