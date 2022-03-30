import { useCall } from '@usedapp/core'

import { useDevconContract } from './contract'

function useAuctionTime() {
  const devconContract = useDevconContract()
  const { value, error } = useCall({
    contract: devconContract,
    method: 'biddingStartTime',
    args: [],
  })
  return { value, error }
}
