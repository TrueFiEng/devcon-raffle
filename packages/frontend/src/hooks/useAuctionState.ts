import { Chain, ChainId, useConfig, useEthers } from '@usedapp/core'
import { ContractState, useContractState } from 'src/hooks/useContractState'

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
  const { state } = useContractState()

  if (state === ContractState.AWAITING_BIDDING) {
    return 'AwaitingBidding'
  }

  if (state === ContractState.BIDDING_OPEN) {
    return getStateUsingWallet(account, chainId, networks, 'BiddingFlow')
  }

  if (state === ContractState.BIDDING_CLOSED || state === ContractState.AUCTION_SETTLED) {
    return 'AwaitingResults'
  }

  if (state === ContractState.RAFFLE_SETTLED) {
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
