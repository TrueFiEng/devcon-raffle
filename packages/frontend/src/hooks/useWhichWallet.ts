import { useEthers } from '@usedapp/core'

interface WhichWallet {
  isMetaMask: boolean
  isWalletConnect: boolean
  isPortis: boolean
}

export function useWhichWallet(): WhichWallet {
  const { library } = useEthers()
  const { isMetaMask, bridge: isWalletConnect, isPortis } = (library as any).provider
  return { isMetaMask, isWalletConnect, isPortis }
}
