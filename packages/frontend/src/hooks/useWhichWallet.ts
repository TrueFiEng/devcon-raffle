import { useEthers } from '@usedapp/core'

export function useWhichWallet() {
  const { library } = useEthers()
  const { isMetaMask, bridge: isWalletConnect, isPortis } = (library as any).provider
  return { isMetaMask, isWalletConnect, isPortis }
}
