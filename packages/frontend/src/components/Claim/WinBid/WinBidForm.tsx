import { BigNumber } from '@ethersproject/bignumber'
import { useEffect } from 'react'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { Button } from 'src/components/Buttons/Button'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'
import { Form, FormHeading, FormText } from 'src/components/Form/Form'
import { useClaimVoucher } from 'src/hooks/backend/useClaimVoucher'
import { useNonce } from 'src/hooks/backend/useNonce'
import { useClaimingEndTime } from 'src/hooks/useClaimingEndTime'
import { UserBid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import styled from 'styled-components'

const winText = {
  [WinType.Loss]: 'We are sorry, but you did not win in auction or raffle.',
  [WinType.GoldenTicket]: 'You won the Golden Ticket!',
  [WinType.Auction]: 'You bid was in the top 20, so you win a ticket to Devcon 6!',
  [WinType.Raffle]: 'You were chosen in the raffle!',
}

const withdrawText = {
  [WinType.Loss]: `You can withdraw your bid amount minus 2% fee.`,
  [WinType.GoldenTicket]: 'This means your ticket is free, so you can withdraw all your funds.',
  [WinType.Raffle]: 'This means that you can withdraw all funds you bid over the reserve price.',
}

interface WinBidFormProps {
  userBid: UserBid
  withdrawalAmount: BigNumber
  setView: (state: TxFlowSteps) => void
  voucher: boolean
  setVoucher: (val: boolean) => void
}

export const WinBidForm = ({ userBid, withdrawalAmount, setView, voucher, setVoucher }: WinBidFormProps) => {
  const isWinningBid = userBid.winType !== WinType.Loss
  const { claimingEndTime } = useClaimingEndTime()
  const { nonce, getNonce } = useNonce()
  const claimVoucherCode = useClaimVoucher()
  useEffect(() => {
    if (nonce) {
      claimVoucherCode(nonce).then(console.log)
    }
  }, [nonce, claimVoucherCode])

  return (
    <Form>
      <WinFormHeading voucher={voucher}>{isWinningBid ? 'Congratulations 🎉 ' : 'No luck 😔'}</WinFormHeading>
      <FormText>{winText[userBid.winType]}</FormText>
      {!userBid.claimed && userBid.winType !== WinType.Auction && (
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

      {!voucher && isWinningBid && (
        <WinOption>
          <span>Claim your voucher code now!</span>
          <Button view="primary" onClick={() => getNonce()}>
            Get voucher code
          </Button>
        </WinOption>
      )}

      {!isWinningBid && !userBid.claimed && (
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
