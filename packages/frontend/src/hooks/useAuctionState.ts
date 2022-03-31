import { Chain, ChainId, useConfig, useEthers } from '@usedapp/core'
import { ContractState } from './useContractState'
import { useState } from 'react'

export type AuctionState =
  | 'AwaitingBidding'
  | 'WalletNotConnected'
  | 'WrongNetwork'
  | 'BiddingFlow'
  | 'AwaitingResults'
  | 'ClaimingFlow'

 


export function useAuctionState(): AuctionState {
  const { account, chainId } = useEthers()
  const { networks } = useConfig()
  const [contractState] = useState(ContractState.BIDDING_OPEN)

  if (contractState === ContractState.AWAITING_BIDDING) {
    return 'AwaitingBidding'
  }

  if (contractState === ContractState.BIDDING_OPEN) {
    return getStateUsingWallet(account, chainId, networks, 'BiddingFlow')
  }

  if (contractState === ContractState.BIDDING_CLOSED || contractState === ContractState.AUCTION_SETTLED) {
    return 'AwaitingResults'
  }

  if (contractState === ContractState.RAFFLE_SETTLED) {
    return getStateUsingWallet(account, chainId, networks, 'ClaimingFlow')
  }

  throw new Error('unknown state')
}

function getStateUsingWallet(
  account: string | null | undefined,
  chainId: ChainId | undefined,
  networks: Chain[] | undefined,
  state: AuctionState
) {
  if (!account) {
    return 'WalletNotConnected'
  }

  const allowedChainIDs = networks?.map((n) => n.chainId)
  if (!chainId || !allowedChainIDs || !allowedChainIDs.includes(chainId)) {
    return 'WrongNetwork'
  }

  return state
}
