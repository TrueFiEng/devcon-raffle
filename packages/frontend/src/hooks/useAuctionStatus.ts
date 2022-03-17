import { ChainId, useEthers } from '@usedapp/core'
import { useState } from 'react';
import { CONFIG } from 'src/config/config'

export type AuctionStatus =
  'NotConnected' |
  'WrongNetwork' |
  'BiddingFlow'

enum ContractState {
  AWAITING_BIDDING,
  BIDDING_OPEN,
  BIDDING_CLOSED,
  AUCTION_SETTLED,
  RAFFLE_SETTLED,
  CLAIMING_CLOSED,
}

export function useAuctionStatus(): AuctionStatus {
  const { chainId } = useEthers()
  const [contractState] = useState(ContractState.BIDDING_OPEN)

  if (contractState === ContractState.BIDDING_OPEN) {
    return getStatusWithWallet(chainId, 'BiddingFlow')
  }

  throw new Error('unknown state')
}

function getStatusWithWallet(chainId: ChainId | undefined, status: AuctionStatus) {
  if (!chainId) {
    return 'NotConnected'
  }
  if (!CONFIG.allowedNetworks.includes(chainId)) {
    return 'WrongNetwork'
  }

  return status
}
