import { BigNumber } from '@ethersproject/bignumber'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { Button } from 'src/components/Buttons/Button'
import { WinOptions } from 'src/components/Claim/WinBid/WinFlowEnum'
import { Form, FormHeading, FormText } from 'src/components/Form/Form'
import { useClaimingEndTime } from 'src/hooks/useClaimingEndTime'
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
  setView: (state: TxFlowSteps) => void
  voucher: boolean
  setVoucher: (val: boolean) => void
}

export const WinBidForm = ({
  win,
  bid,
  withdrawnBid,
  setWithdrawnBid,
  setView,
  voucher,
  setVoucher,
}: WinBidFormProps) => {
  const luck = win !== undefined
  const { claimingEndTime } = useClaimingEndTime()

  return (
    <Form>
      <WinFormHeading voucher={voucher}>{luck ? 'Congratulations 🎉 ' : 'No luck 😔'}</WinFormHeading>
      <FormText>{luck ? winText[win] : 'We are sorry, but you did not qualify for the Raffle.'}</FormText>
      {!withdrawnBid && win !== WinOptions.Auction && (
        <WinOption>
          <span>{luck ? withdrawText[win] : 'You can withdraw your bid amount minus 2% fee.'}</span>
          <Button
            view="primary"
            onClick={() => {
              setView(TxFlowSteps.Review)
              setWithdrawnBid(true)
            }}
          >
            <span>Withdraw {formatEtherAmount(bid)} ETH</span>
          </Button>
        </WinOption>
      )}

      {!voucher && luck && (
        <WinOption>
          <span>Get your voucher code</span>
          <Button view="primary" onClick={() => setVoucher(true)}>
            Get voucher code
          </Button>
        </WinOption>
      )}

      {!luck && !withdrawnBid && (
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
