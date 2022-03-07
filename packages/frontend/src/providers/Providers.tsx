import { DAppProvider } from '@usedapp/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const Providers = ({ children }: Props) => <DAppProvider config={{}}>{children}</DAppProvider>
