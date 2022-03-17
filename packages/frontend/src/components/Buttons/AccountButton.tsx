import { shortenAddress, useEthers } from '@usedapp/core'
import styled from 'styled-components'

import { Button } from './Button'
import { ConnectWalletButton } from './ConnectWalletButton'

export const AccountButton = () => {
  const { account } = useEthers()

  return account ? (
    <ConnectedButton view="secondary">{shortenAddress(account)}</ConnectedButton>
  ) : (
    <ConnectWalletButton view="secondary" />
  )
}

const ConnectedButton = styled(Button)`
  cursor: default;
  &:hover {
    background-color: unset;
  }
`
