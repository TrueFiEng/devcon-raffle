import { DAppProvider } from '@usedapp/core'
import { ReactNode } from 'react'
import { CONFIG } from 'src/config/config'

import { BidsProvider } from './Bids/provider'
import { Web3ModalProvider } from './Web3Modal/provider'

interface Props {
  children: ReactNode
}

export const Providers = ({ children }: Props) => (
  <DAppProvider config={CONFIG.useDAppConfig}>
    <Web3ModalProvider>
      <BidsProvider>{children}</BidsProvider>
    </Web3ModalProvider>
  </DAppProvider>
)
