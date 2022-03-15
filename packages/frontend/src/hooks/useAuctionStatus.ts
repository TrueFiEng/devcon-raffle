import { ChainId, useEthers } from '@usedapp/core'

type AuctionStatus = 'NotConnected' | 'WrongNetwork' | 'Connected'

export function useAuctionStatus(): AuctionStatus {
  const { account, chainId } = useEthers()

  if (!account) {
    return 'NotConnected'
  }

  if (chainId !== ChainId.Arbitrum) {
    return 'WrongNetwork'
  }

  return 'Connected'
}
