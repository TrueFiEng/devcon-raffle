import { shortenAddress, useEthers } from '@usedapp/core'
import { useCallback } from 'react'
import { Button } from 'src/components/Buttons/Button'
import { ConnectWalletButton } from 'src/components/Buttons/ConnectWalletButton'
import { useWeb3Modal } from 'src/hooks/useWeb3Modal'
import { removeWalletLinkStorage } from 'src/utils/removeWalletLinkStorage'
import styled from 'styled-components'

export const AccountButton = () => {
  const { account, deactivate } = useEthers()
  const web3Modal = useWeb3Modal()

  const disconnect = useCallback(async () => {
    localStorage.removeItem('walletconnect')
    removeWalletLinkStorage()
    web3Modal.clearCachedProvider()
    deactivate()
  }, [deactivate, web3Modal])

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
