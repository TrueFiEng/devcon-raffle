import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { ReactNode, useMemo } from 'react'
import { DEVCON6_ABI } from 'src/constants/abis'
import { BidWithPlace } from 'src/models/Bid'
import { useBidEvents } from 'src/providers/Bids/useBidEvents'

import { BidsContext } from './context'

interface Props {
  children: ReactNode
}

interface BidEventDetails {
  bidAmount: BigNumber
  bidID: BigNumber
}

export const BidsProvider = ({ children }: Props) => {
  const bidsEvents = useBidEvents()

  const bids: BidWithPlace[] = useMemo(() => {
    const abi = new Interface(DEVCON6_ABI)
    const addressToBidMap = bidsEvents.reduce<Record<string, BidEventDetails>>((dict, log) => {
      const event = abi.parseLog(log)
      const { bidder, bidAmount, bidID } = event.args
      if (!(bidder in dict) || dict[bidder].bidAmount.lt(bidAmount)) {
        dict[bidder] = { bidAmount, bidID }
      }
      return dict
    }, {})

    return Object.entries(addressToBidMap)
      .sort(([, a], [, b]) => compareBidEvent(a, b))
      .map(([bidderAddress, { bidAmount }], index) => ({ bidderAddress, amount: bidAmount, place: index + 1 }))
  }, [bidsEvents])

  return <BidsContext.Provider value={{ bids }}>{children}</BidsContext.Provider>
}

const compareBidEvent = (a: BidEventDetails, b: BidEventDetails) =>
  compareBigNumber(b.bidAmount, a.bidAmount) || compareBigNumber(a.bidID, b.bidID)

function compareBigNumber(a: BigNumber, b: BigNumber) {
  if (a.lt(b)) {
    return -1
  }
  return a.gt(b) ? 1 : 0
}
