import { ConnectWalletButton } from '../Buttons'
import { FormHeading, FormRow, FormWrapper } from '../Form/Form'

export const ConnectWalletWarning = () => {
  return (
    <FormWrapper>
      <FormHeading>Place bid</FormHeading>
      <FormRow>
        <span>To place a bid connect your wallet</span>
      </FormRow>
      <ConnectWalletButton />
    </FormWrapper>
  )
}
