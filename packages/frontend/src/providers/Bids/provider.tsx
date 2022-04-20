import { BigNumber } from '@ethersproject/bignumber'
import { ReactNode, useMemo } from 'react'
import { useContractBids } from 'src/hooks/useContractBids'
import { Bid } from 'src/models/Bid'

import { BidsContext } from './context'
import { BidsState } from './reducer'

interface Props {
  children: ReactNode
}

interface BidDetails {
  bidderID: BigNumber
  amount: BigNumber
}

export const BidsProvider = ({ children }: Props) => {
  const contractBids = useContractBids()

  const bidsState: BidsState = useMemo(() => sortContractBids(contractBids), [contractBids])
  return <BidsContext.Provider value={{ bidsState }}>{children}</BidsContext.Provider>
}

function sortContractBids(contractBids: Bid[]) {
  const sortedBids = contractBids.sort((a, b) => compareBidDetails(a, b)).map((bid, index) => ({
    ...bid,
    place: index + 1
  }))
  const bidsState: BidsState = {
    bids: sortedBids,
    bidders: new Map()
  }
  sortedBids.forEach(({ bidderAddress }, index) => {
    bidsState.bidders.set(bidderAddress, index)
  })
  return bidsState
}

const compareBidDetails = (a: BidDetails, b: BidDetails) =>
  compareBigNumber(b.amount, a.amount) || compareBigNumber(a.bidderID, b.bidderID)

function compareBigNumber(a: BigNumber, b: BigNumber) {
  if (a.lt(b)) {
    return -1
  }
  return a.gt(b) ? 1 : 0
}
