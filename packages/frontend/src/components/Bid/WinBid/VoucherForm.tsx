import { shortenTransactionHash } from '@usedapp/core'
import { Button, CopyButton } from 'src/components/Buttons'
import { Form, FormHeading } from 'src/components/Form/Form'
import { InputLabel } from 'src/components/Form/Input'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface Props {
  voucher: string
  withdrawnBid: boolean
}

export const VoucherForm = ({ voucher, withdrawnBid }: Props) => {
  return (
    <Form>
      <VoucherFormHeading voucher={voucher} withdrawnBid={withdrawnBid}>
        Here is your voucher code
      </VoucherFormHeading>
      <VoucherIdBox>
        <VoucherIdText>{shortenTransactionHash(voucher)}</VoucherIdText>
        <CopyButton value={voucher} side="top" text="Copy transaction ID" />
      </VoucherIdBox>

      <VoucherButtonWrapper>
        <VoucherIdLabel>Enter this code in the sales system</VoucherIdLabel>
        <Button view="primary" onClick={() => window.open('https://devcon.org/en/#road-to-devcon', '_blank')}>
          Go to sales system
        </Button>
      </VoucherButtonWrapper>
    </Form>
  )
}

const VoucherButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const VoucherIdLabel = styled(InputLabel)`
  justify-content: flex-start;
  margin-bottom: 8px;
`

const VoucherFormHeading = styled(FormHeading)<Props>`
  font-size: ${({ voucher, withdrawnBid }) => (voucher && !withdrawnBid ? '24px' : '40px')};
  line-height: ${({ voucher, withdrawnBid }) => (voucher && !withdrawnBid ? 1 : 1.2)};
`

const VoucherIdBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${Colors.White};
  padding: 8px 12px;
  height: 40px;
  max-width: 289px;
`

const VoucherIdText = styled.span`
  flex: 1;
  color: ${Colors.Grey};
`
