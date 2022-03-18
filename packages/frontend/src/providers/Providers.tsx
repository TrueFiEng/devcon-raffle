import { DAppProvider } from '@usedapp/core'
import { ReactNode } from 'react'
import { CONFIG } from 'src/config/config'

interface Props {
  children: ReactNode
}

export const Providers = ({ children }: Props) => <DAppProvider config={CONFIG.useDAppConfig}>{children}</DAppProvider>
