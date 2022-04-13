import { useCallback } from 'react'
import { BidWithPlace } from 'src/models/Bid'

export const useSearchBid = (value: string) =>
  useCallback(
    (bids: BidWithPlace[]) => (value ? bids.filter((bid) => bid.bidderAddress.includes(value)) : bids),
    [value]
  )
