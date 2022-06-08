import { useContext } from 'react'
import { BidsContext } from 'src/providers/Bids/context'

export const useBids = () => {
  console.log('useBids')
  const { bidsState } = useContext(BidsContext)
  return {
    bids: bidsState.get('bids'),
    bidders: bidsState.get('bidders'),
  }
}
