import { ConnectWalletButton } from 'src/components/Buttons'
import { FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { useContractState } from 'src/hooks/useContractState'
import styled from 'styled-components'

import { getWarningText } from './getWarningText'

export const ConnectWalletWarning = () => {
  const { state } = useContractState()
  const text = getWarningText(state)

  return (
    <ConnectFormWrapper>
      <FormHeading>{text.heading}</FormHeading>
      <FormRow>
        <span>To {text.action} connect your wallet</span>
      </FormRow>
      <ConnectWalletButton />
    </ConnectFormWrapper>
  )
}

const ConnectFormWrapper = styled(FormWrapper)`
  justify-content: center;
  padding: 0 218px;
`
