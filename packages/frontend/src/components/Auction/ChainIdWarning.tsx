import { useSwitchChain } from 'src/hooks/useSwitchChain'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { Button } from '../Buttons/Button'
import { FormHeading, FormRow, FormWrapper } from '../Form/Form'

export const ChainIdWarning = () => {
  const switchChain = useSwitchChain()
  return (
    <FormWrapper>
      <FormHeading>Place bid</FormHeading>
      <FormRow>
        <span>You are connected to the wrong network.</span>
      </FormRow>
      <FormRow>
        <span>To place a bid connect your wallet to the Arbitrum network.</span>
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
      <Button onClick={switchChain}>Change network</Button>
    </FormWrapper>
  )
}

const TutorialLink = styled.a`
  color: ${Colors.GreenLight};
  text-decoration: underline;
`
