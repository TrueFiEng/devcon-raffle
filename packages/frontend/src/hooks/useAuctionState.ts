import { ChainId, useEthers } from '@usedapp/core'
import { useState } from 'react'
import { CONFIG } from 'src/config/config'

export type AuctionState = 'NotConnected' | 'WrongNetwork' | 'BiddingFlow'

enum ContractState {
  AWAITING_BIDDING,
  BIDDING_OPEN,
  BIDDING_CLOSED,
  AUCTION_SETTLED,
  RAFFLE_SETTLED,
  CLAIMING_CLOSED,
}

export function useAuctionState(): AuctionState {
  const { chainId } = useEthers()
  const [contractState] = useState(ContractState.BIDDING_OPEN)

  if (contractState === ContractState.BIDDING_OPEN) {
    return getStateUsingWallet(chainId, 'BiddingFlow')
  }

  throw new Error('unknown state')
}

function getStateUsingWallet(chainId: ChainId | undefined, state: AuctionState) {
  if (!chainId) {
    return 'NotConnected'
  }
  if (!CONFIG.allowedNetworks.includes(chainId)) {
    return 'WrongNetwork'
  }

  return state
}
