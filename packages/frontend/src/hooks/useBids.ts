import { useContext } from 'react'
import { BidsContext } from 'src/providers/Bids'

export const useBids = () => useContext(BidsContext)
