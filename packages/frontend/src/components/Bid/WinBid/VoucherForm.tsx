import { shortenTransactionHash } from '@usedapp/core'
import { Button, CopyButton, RedirectButton } from 'src/components/Buttons'
import { Form, FormWrapper, FormHeading } from 'src/components/Form/Form'
import { InputLabel } from 'src/components/Form/Input'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface Props {
  voucher: string
}

export const VoucherForm = ({ voucher }: Props) => {
  return (
    <VoucherFormWrapper>
      <Form>
        <FormHeading>Here is your voucher code</FormHeading>
        <VoucherIdBox>
          <VoucherIdText>{shortenTransactionHash(voucher)}</VoucherIdText>
          <CopyButton value={voucher} side="top" text="Copy transaction ID" />
          <RedirectButton link="https://devcon.org/en/#road-to-devcon" side="top" tooltip="Go to sales system" />
        </VoucherIdBox>

        <VoucherButtonWrapper>
          <VoucherIdLabel>Enter this code in the sales system</VoucherIdLabel>
          <Button view="primary" onClick={() => window.open('https://devcon.org/en/#road-to-devcon', '_blank')}>
            Go to sales system
          </Button>
        </VoucherButtonWrapper>
      </Form>
    </VoucherFormWrapper>
  )
}

const VoucherFormWrapper = styled(FormWrapper)`
  width: 100%;
`

const VoucherButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const VoucherIdLabel = styled(InputLabel)`
  justify-content: flex-start;
  margin-bottom: 8px;
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
