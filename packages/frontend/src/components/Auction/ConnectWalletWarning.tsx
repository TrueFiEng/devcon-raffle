import { Button } from '../Buttons/Button'
import { FormHeading, FormRow, FormWrapper } from '../Form/Form'

export const ConnectWalletWarning = () => {
  return (
    <FormWrapper>
      <FormHeading>Place bid</FormHeading>
      <FormRow>
        <span>To place a bid connect your wallet</span>
      </FormRow>
      <Button>Connect wallet</Button>
    </FormWrapper>
  )
}
