import { Button } from 'src/components/Buttons'
import { FormHeading, FormRow, FormWrapper } from 'src/components/Form/Form'
import { useContractState } from 'src/hooks/useContractState'
import { useSwitchChain } from 'src/hooks/useSwitchChain'
import { Colors } from 'src/styles/colors'
import { detectMetaMask } from 'src/utils/detectMetamask'
import styled from 'styled-components'

import { getWarningText } from './getWarningText'

export const ChainIdWarning = () => {
  const switchChain = useSwitchChain()
  const isProviderMetamask = detectMetaMask()
  const { state } = useContractState()
  const text = getWarningText(state)

  return (
    <FormWrapper>
      <FormHeading>{text.heading}</FormHeading>
      <FormRow>
        <span>You are connected to the wrong network.</span>
      </FormRow>
      <FormRow>
        <span>To {text.action} connect your wallet to the <b>Arbitrum network.</b></span>
      </FormRow>
      <FormRow>
        <span>
          <TutorialLink
            target="_blank"
            href="https://consensys.net/blog/metamask/how-to-bridge-your-assets-to-arbitrum-using-metamask/"
          >
            Click here to read the tutorial
          </TutorialLink>{' '}
          »
        </span>
      </FormRow>
      {isProviderMetamask && <Button onClick={switchChain}>Change network</Button>}
    </FormWrapper>
  )
}

const TutorialLink = styled.a`
  color: ${Colors.GreenLight};
  text-decoration: underline;
`
