import { shortenAddress, useEthers } from '@usedapp/core'
import { Button } from 'src/components/Buttons/Button'
import { ConnectWalletButton } from 'src/components/Buttons/ConnectWalletButton'
import { AccountDetailModal } from 'src/components/Modal/AccountDetailModal'
import { useModal } from 'src/hooks/useModal'

export const AccountButton = () => {
  const { account } = useEthers()
  const { isShown, toggle } = useModal()

  return (
    <>
      {account ? (
        <Button view="secondary" onClick={toggle}>
          {shortenAddress(account)}
        </Button>
      ) : (
        <ConnectWalletButton view="secondary" />
      )}
      {account && isShown && <AccountDetailModal isShown={isShown} onRequestClose={toggle} />}
    </>
  )
}
