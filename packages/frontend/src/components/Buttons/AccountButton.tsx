import { shortenAddress, useEthers } from '@usedapp/core'
import { useCallback } from 'react'
import styled from 'styled-components'

import { Button } from './Button'
import { ConnectWalletButton } from './ConnectWalletButton'

export const AccountButton = () => {
  const { account, deactivate } = useEthers()

  const disconnect = useCallback(async () => {
    localStorage.removeItem('walletconnect')
    deactivate()
  }, [deactivate])

  return account ? (
    <>
      <ConnectedButton view="secondary" onClick={disconnect}>
        Disconnect
      </ConnectedButton>
      <ConnectedButton view="secondary">{shortenAddress(account)}</ConnectedButton>
    </>
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
