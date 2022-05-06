import { useEthers } from '@usedapp/core'
import { useModal } from 'src/hooks/useModal'

import { AddWalletModal } from '../Modal/AddWalletModal'

import { Button, ButtonProps } from './Button'

type ConnectWalletButtonProps = Omit<ButtonProps, 'onClick' | 'children'>

export const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  const { activateBrowserWallet } = useEthers()
  const { isShown, toggle } = useModal()

  function detectMetaMask() {
    const { web3, ethereum } = window as any
    if (!ethereum && !web3) return false
    return ethereum?.isMetaMask || web3?.currentProvider?.isMetaMask
  }

  return (
    <>
      <Button {...props} onClick={detectMetaMask() ? activateBrowserWallet : toggle}>
        Connect Wallet
      </Button>
      {<AddWalletModal isShown={isShown} onRequestClose={toggle} />}
    </>
  )
}
