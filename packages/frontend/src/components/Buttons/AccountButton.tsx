import { shortenAddress, useEthers } from '@usedapp/core'
import { Button } from 'src/components/Buttons/Button'
import { ConnectWalletButton } from 'src/components/Buttons/ConnectWalletButton'
import { AccountDetailModal } from 'src/components/Modal/AccountDetailModal'
import { useModal } from 'src/hooks/useModal'
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
  &:hover {
    background-color: unset;
  }
`
