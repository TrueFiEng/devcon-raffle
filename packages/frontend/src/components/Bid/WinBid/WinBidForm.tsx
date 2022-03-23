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
  win?: WinOptions
  bid: BigNumber
  withdrawnBid: boolean
  setWithdrawnBid: (val: boolean) => void
  setView: (state: BidFlowSteps) => void
  setShowVoucher: (val: boolean) => void
}

export const WinBidForm = ({ win, bid, withdrawnBid, setWithdrawnBid, setView, setShowVoucher }: WinBidFormProps) => {
  const luck = win !== undefined

  return (
    <WinFormWrapper>
      <FormHeading>{luck ? 'Congratulations 🎉 ' : 'No luck 😔'}</FormHeading>
      <WinText>{luck ? winText[win] : 'We are sorry, but you did not qualify for the Raffle.'}</WinText>
      {!withdrawnBid && win !== WinOptions.Auction && (
        <WinOption>
          <span>{luck ? withdrawText[win] : 'You can withdraw your bid amount minus 2% fee.'}</span>
          <Button
            view="primary"
            onClick={() => {
              setView(BidFlowSteps.Review)
              setWithdrawnBid(true)
            }}
          >
            <span>Withdraw {formatEtherAmount(bid)} ETH</span>
          </Button>
        </WinOption>
      )}

      <WinOption>
        {luck ? (
          <>
            <span>Get your voucher code</span>
            <Button view="primary" onClick={() => setShowVoucher(true)}>
              Get voucher code
            </Button>
          </>
        ) : (
          !withdrawnBid && <span>You have time until XX.XX.2023 to withdraw your funds.</span>
        )}
      </WinOption>
    </WinFormWrapper>
  )
}

const WinFormWrapper = styled(FormWrapper)`
  justify-content: center;
`
const WinText = styled.p`
  color: ${Colors.White};
`

const WinOption = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  color: ${Colors.White};
`
