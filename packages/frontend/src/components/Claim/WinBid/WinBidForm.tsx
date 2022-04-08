import { BigNumber } from '@ethersproject/bignumber'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { Button } from 'src/components/Buttons/Button'
import { WinOptions } from 'src/components/Claim/WinBid/WinFlowEnum'
import { Form, FormHeading, FormText } from 'src/components/Form/Form'
import { useClaimingEndTime } from 'src/hooks/useClaimingEndTime'
import { SettledBid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import styled from 'styled-components'

const winText = {
  [WinOptions.Loss]: 'We are sorry, but you did not qualify for the Raffle.',
  [WinOptions.Ticket]: 'You won the Golden Ticket!',
  [WinOptions.Auction]: 'You bid was in the top 20, so you win a ticket to Devcon 6!',
  [WinOptions.Raffle]: 'You were chosen in the raffle!',
}

const withdrawText = {
  [WinOptions.Loss]: `You can withdraw your bid amount minus 2% fee.`,
  [WinOptions.Ticket]: 'This means your ticket is free, so you can withdraw all your funds.',
  [WinOptions.Raffle]: 'This means that you can withdraw all funds you bid over the reserve price.',
}

interface WinBidFormProps {
  userBid: SettledBid
  withdrawalAmount: BigNumber
  setView: (state: TxFlowSteps) => void
  voucher: boolean
  setVoucher: (val: boolean) => void
}

export const WinBidForm = ({ userBid, withdrawalAmount, setView, voucher, setVoucher }: WinBidFormProps) => {
  const luck = userBid.winType !== WinOptions.Loss
  const { claimingEndTime } = useClaimingEndTime()

  return (
    <Form>
      <WinFormHeading voucher={voucher}>{luck ? 'Congratulations 🎉 ' : 'No luck 😔'}</WinFormHeading>
      <FormText>{winText[userBid.winType]}</FormText>
      {!userBid.claimed && userBid.winType !== WinOptions.Auction && (
        <WinOption>
          <span>{withdrawText[userBid.winType]}</span>
          <Button
            view="primary"
            onClick={() => {
              setView(TxFlowSteps.Review)
            }}
          >
            <span>Withdraw {formatEtherAmount(withdrawalAmount)} ETH</span>
          </Button>
        </WinOption>
      )}

      {!voucher && luck && (
        <WinOption>
          <span>Claim your voucher code now!</span>
          <Button view="primary" onClick={() => setVoucher(true)}>
            Get voucher code
          </Button>
        </WinOption>
      )}

      {!luck && !userBid.claimed && (
        <WinOption>
          <span>You have time until {claimingEndTime} to withdraw your funds.</span>
        </WinOption>
      )}
    </Form>
  )
}

const WinOption = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  color: ${Colors.White};
`
const WinFormHeading = styled(FormHeading)<{ voucher: boolean }>`
  font-size: ${({ voucher }) => (voucher ? '24px' : '40px')};
`
