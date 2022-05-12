import { shortenAddress, useEthers } from '@usedapp/core'
import { Button } from 'src/components/Buttons/Button'
import { ConnectWalletButton } from 'src/components/Buttons/ConnectWalletButton'
import styled from 'styled-components'

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
