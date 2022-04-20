import { useContext, useMemo } from 'react'
import { BidsContext } from 'src/providers/Bids'

export const useBids = () => {
  const context = useContext(BidsContext)
  return useMemo(() => context.bidsState, [context])
}
