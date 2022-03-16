import { useEthers } from '@usedapp/core'
import { CONFIG } from 'src/config/config'

type AuctionStatus = 'NotConnected' | 'WrongNetwork' | 'Connected'

export function useAuctionStatus(): AuctionStatus {
  const { account, chainId } = useEthers()

  if (chainId && CONFIG.allowedNetworks.includes(chainId)) {
    return 'WrongNetwork'
  }

  if (!account) {
    return 'NotConnected'
  }

  return 'Connected'
}
