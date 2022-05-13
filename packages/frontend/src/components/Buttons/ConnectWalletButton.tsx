import { useEthers } from '@usedapp/core'
import { Button, ButtonProps } from 'src/components/Buttons/Button'
import { useWeb3Modal } from 'src/hooks/useWeb3Modal'


type ConnectWalletButtonProps = Omit<ButtonProps, 'onClick' | 'children'>

export const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  const { activate } = useEthers()
  const web3modal = useWeb3Modal()

  const activateProvider = async () => {
    try {
      const provider = await web3modal.connect()
      await activate(provider)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <>
      <Button {...props} onClick={activateProvider}>
        Connect Wallet
      </Button>
    </>
  )
}
