import { DAppProvider } from '@usedapp/core'
import { ReactNode } from 'react'
import { CONFIG } from 'src/config/config'

import { BidsProvider } from './Bids/provider'

interface Props {
  children: ReactNode
}

export const Providers = ({ children }: Props) => (
  <DAppProvider config={CONFIG.useDAppConfig}>
    <BidsProvider>{children}</BidsProvider>
  </DAppProvider>
)
