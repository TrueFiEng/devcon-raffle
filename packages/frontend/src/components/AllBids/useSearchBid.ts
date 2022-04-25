import { useCallback } from 'react'
import { Bid } from 'src/models/Bid'

export function useSearchBid(value: string) {
  return useCallback(
    (bids: Bid[]) => {
      if (value !== '') {
        return bids.filter((bid) => bid.bidderAddress.includes(value))
      }
      return bids
    },
    [value]
  )
}
