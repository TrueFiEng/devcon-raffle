import { useAccount, useChainId, useReadContract } from 'wagmi'
import { AUCTION_ABI } from '@/blockchain/abi/auction'
import { AUCTION_ADDRESSES } from '@/blockchain/auctionAddresses'
import { Hex } from 'viem'
import { ContractState } from '../abi/ContractState'

export type AuctionState =
  | 'AwaitingBidding'
  | 'WalletNotConnected'
  | 'WrongNetwork'
  | 'BiddingFlow'
  | 'AwaitingResults'
  | 'ClaimingFlow'
  | 'ClaimingClosed'
  | 'GitcoinFlow'

export function useAuctionState(): AuctionState | undefined {
  const { address, chainId: userChainId } = useAccount()
  const chainId = useChainId()
  const { state, isLoading } = useContractState()
  if (isLoading) {
    return undefined
  }

  if (state === ContractState.AWAITING_BIDDING) {
    return 'AwaitingBidding'
  }

  if (state === ContractState.BIDDING_OPEN) {
    return getStateForWallet({ address, userChainId, chainId, state: 'BiddingFlow' })
  }

  if (state === ContractState.BIDDING_CLOSED || state === ContractState.AUCTION_SETTLED) {
    return 'AwaitingResults'
  }

  if (state === ContractState.RAFFLE_SETTLED) {
    return getStateForWallet({ address, userChainId, chainId, state: 'ClaimingFlow' })
  }

  if (state === ContractState.CLAIMING_CLOSED) {
    return 'ClaimingClosed'
  }

  throw new Error('unknown state')
}

export const useContractState = () => {
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    chainId,
    abi: AUCTION_ABI,
    address: AUCTION_ADDRESSES[chainId],
    functionName: 'getState',
  })

  return { state: data as ContractState, isLoading }
}

interface GetStateForWalletParams {
  address: Hex | undefined
  userChainId: number | undefined
  chainId: number
  state: AuctionState
}

function getStateForWallet(params: GetStateForWalletParams): AuctionState {
  if (!params.address) {
    return 'WalletNotConnected'
  }

  if (params.userChainId !== params.chainId) {
    return 'WrongNetwork'
  }

  return params.state
}
