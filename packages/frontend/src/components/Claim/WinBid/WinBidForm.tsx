import { BigNumber } from '@ethersproject/bignumber'
import { TxFlowSteps } from 'src/components/Auction'
import { Button } from 'src/components/Buttons'
import { ClaimVoucherSection, WinType } from 'src/components/Claim'
import { Form, FormHeading, FormText } from 'src/components/Form/Form'
import { UserBid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters'
import styled from 'styled-components'

const winText = {
  [WinType.Loss]: 'We are sorry, but you did not win in auction or raffle.',
  [WinType.GoldenTicket]: 'You won the Golden Ticket!',
  [WinType.Auction]: 'Your bid was in the top 20, so you win a ticket to Devcon 6!',
  [WinType.Raffle]: 'You were chosen in the raffle and have successfully purchased a ticket!',
}

const withdrawText = {
  [WinType.Loss]: `You can withdraw your bid amount minus the 2% fee.`,
  [WinType.GoldenTicket]: 'This means your ticket is free, so you can withdraw all your funds.',
  [WinType.Raffle]: 'This means that you can withdraw all funds you bid over the reserve price.',
}

interface WinBidFormProps {
  userBid: UserBid
  withdrawalAmount: BigNumber
  setView: (state: TxFlowSteps) => void
  voucher: string | undefined
  setVoucher: (val: string) => void
}

export const WinBidForm = ({ userBid, withdrawalAmount, setView, voucher, setVoucher }: WinBidFormProps) => {
  const isWinningBid = userBid.winType !== WinType.Loss

  return (
    <WinnerForm>
      <WinFormHeading voucher={voucher}>{isWinningBid ? 'Congratulations 🎉 ' : 'No luck 😔'}</WinFormHeading>
      <FormText>{winText[userBid.winType]}</FormText>
      {!userBid.claimed && userBid.winType !== WinType.Auction && (
        <WinOption>
          <span>{withdrawText[userBid.winType]}</span>
          <Button view="primary" onClick={() => setView(TxFlowSteps.Review)} wide>
            <span>Withdraw {formatEtherAmount(withdrawalAmount)} ETH</span>
          </Button>
        </WinOption>
      )}

      {!voucher && isWinningBid && <ClaimVoucherSection setVoucher={setVoucher} />}
    </WinnerForm>
  )
}

const WinnerForm = styled(Form)`
  text-align: center;
`

export const WinOption = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  color: ${Colors.White};
`

const WinFormHeading = styled(FormHeading)<{ voucher?: string }>`
  font-size: ${({ voucher }) => (voucher ? '24px' : '40px')};
`
