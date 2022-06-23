export function getWalletName(provider: string, isBraveWallet?: boolean) {
  switch (provider) {
    case 'injected':
      return isBraveWallet ? 'Brave Wallet' : 'MetaMask'
    case 'walletconnect':
      return 'WalletConnect'
    case 'portis':
      return 'Portis'
    case 'coinbasewallet':
      return 'Coinbase Wallet'
    default:
      return '-'
  }
}
