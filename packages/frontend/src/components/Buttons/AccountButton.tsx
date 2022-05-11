import { shortenAddress, useEthers } from '@usedapp/core'
import { Button, ConnectWalletButton } from 'src/components/Buttons'
import { AccountDetailModal } from 'src/components/Modal'
import { useModal } from 'src/hooks'
import styled from 'styled-components'

export const AccountButton = () => {
  const { account } = useEthers()
  const { isShown, toggle } = useModal()

  return (
    <>
      {account ? (
        <ConnectedButton view="secondary" onClick={toggle}>
          {shortenAddress(account)}
        </ConnectedButton>
      ) : (
        <ConnectWalletButton view="secondary" />
      )}
      {account && <AccountDetailModal isShown={isShown} onRequestClose={toggle} />}
    </>
  )
}

const ConnectedButton = styled(Button)`
  cursor: default;
  &:hover {
    background-color: unset;
  }
`
