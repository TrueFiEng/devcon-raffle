import { shortenAddress, useEthers } from '@usedapp/core'
import styled from 'styled-components'

import { Button, ButtonProps } from './Button'

type AccountButtonProps = Omit<ButtonProps, 'onClick' | 'children'>

export const AccountButton = (props: AccountButtonProps) => {
  const { account, activateBrowserWallet } = useEthers()

  return account ? (
    <ConnectedButton {...props}>{shortenAddress(account)}</ConnectedButton>
  ) : (
    <Button {...props} onClick={activateBrowserWallet}>
      Connect Wallet
    </Button>
  )
}

const ConnectedButton = styled(Button)`
  cursor: default;
  &:hover {
    background-color: unset;
  }
`
