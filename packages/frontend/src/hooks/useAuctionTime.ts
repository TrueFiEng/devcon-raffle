import { useCall} from '@usedapp/core'
import { useDevconContract } from './contract'
import { useAuctionState } from './useAuctionState'

export function useAuctionTime() {
  const devconContract = useDevconContract()
  const state = useAuctionState()

  if (!devconContract){
      return
  }

 useCall({
      contract: devconContract, //@ts-ignore
      method: 'biddingStartTime'
  })
  
state === "Awaiting" 
  return { }
}