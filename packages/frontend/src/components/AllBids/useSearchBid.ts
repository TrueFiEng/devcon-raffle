import { useCallback } from 'react'
import { Bid } from 'src/models/Bid'

export const useSearchBid = (value: string) =>
  useCallback((bids: Bid[]) => (value ? bids.filter((bid) => bid.bidderAddress.includes(value)) : bids), [value])
