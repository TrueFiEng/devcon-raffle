import styled from 'styled-components'

import { ConnectWalletButton } from '../Buttons'
import { FormHeading, FormRow, FormWrapper } from '../Form/Form'

export const ConnectWalletWarning = () => {
  return (
    <ConnectFormWrapper>
      <FormHeading>Place bid</FormHeading>
      <FormRow>
        <span>To place a bid connect your wallet</span>
      </FormRow>
      <ConnectWalletButton />
    </ConnectFormWrapper>
  )
}

const ConnectFormWrapper = styled(FormWrapper)`
  justify-content: center;
  padding: 0 218px;
`
