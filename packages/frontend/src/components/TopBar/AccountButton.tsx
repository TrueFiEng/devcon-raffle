import { shortenAddress, useEthers } from '@usedapp/core'

import { Button } from '../Buttons/Button'

export const AccountButton = () => {
  const { account, activateBrowserWallet } = useEthers()

  return account ? (
    <Button view="secondary">{shortenAddress(account)}</Button>
  ) : (
    <Button view="secondary" onClick={activateBrowserWallet}>
      Connect Wallet
    </Button>
  )
}
