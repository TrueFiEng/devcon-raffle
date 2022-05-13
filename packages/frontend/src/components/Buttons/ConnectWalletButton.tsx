import { useEthers } from '@usedapp/core'
import { Button, ButtonProps } from 'src/components/Buttons/Button'

type ConnectWalletButtonProps = Omit<ButtonProps, 'onClick' | 'children'>

export const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  const { activateBrowserWallet } = useEthers()

  return (
    <>
      <Button {...props} onClick={activateBrowserWallet}>
        Connect Wallet
      </Button>
    </>
  )
}
