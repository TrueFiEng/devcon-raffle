import { useSwitchChain } from 'src/hooks/useSwitchChain'

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
      <Button onClick={switchChain}>Change network</Button>
    </FormWrapper>
  )
}
