import { useContractState } from '@/blockchain/hooks/useAuctionState'
import { ContractState } from '../abi/ContractState'
import { useReadAuctionParams } from '@/blockchain/hooks/useReadAuctionParams'

export function useAuctionTime() {
  const { state } = useContractState()
  const { biddingStartTime, biddingEndTime } = useReadAuctionParams()
  return state === ContractState.AWAITING_BIDDING ? biddingStartTime : biddingEndTime
}
