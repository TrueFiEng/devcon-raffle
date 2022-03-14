import { shortenAddress, useEthers } from '@usedapp/core'
import styled from 'styled-components'

import { Button } from '../Buttons/Button'

export const AccountButton = () => {
  const { account, activateBrowserWallet } = useEthers()

  return account ? (
    <ConnectedButton view="secondary">{shortenAddress(account)}</ConnectedButton>
  ) : (
    <Button view="secondary" onClick={activateBrowserWallet}>
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
