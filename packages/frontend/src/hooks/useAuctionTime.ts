import { useCall } from '@usedapp/core'

import { useDevconContract } from './contract'

function useAuctionTime() {
  const devconContract = useDevconContract()
  const { value, error } = useCall({
    contract: devconContract as any,
    method: 'biddingStartTime',
    args: [],
  })
  return { value, error }
}
