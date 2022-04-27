import { useCallback } from 'react'
import { Bid } from 'src/models/Bid'

export const useMatchBid = (value: string) =>
  useCallback((bid: Bid) => (value ? bid.bidderAddress.toLowerCase().includes(value.toLowerCase()) : true), [value])
