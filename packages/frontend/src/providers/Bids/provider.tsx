import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { ReactNode, useMemo } from 'react'
import React from 'react'
import { DEVCON6_ABI } from 'src/constants/abis'
import { BidWithPlace } from 'src/models/Bid'
import { useBidEvents } from 'src/providers/Bids/useBidEvents'

import { BidsContext } from './context'

interface Props {
  children: ReactNode
}

function compareBigNumber(a: BigNumber, b: BigNumber) {
  if (a.lt(b)) {
    return -1
  }
  return a.gt(b) ? 1 : 0
}

export const BidsProvider = ({ children }: Props) => {
  const bidsEvents = useBidEvents()

  const bids: BidWithPlace[] = useMemo(() => {
    const abi = new Interface(DEVCON6_ABI)
    const addressToBidMap = bidsEvents.reduce<Record<string, BigNumber>>((dict, log) => {
      const event = abi.parseLog(log)
      const { bidder, bidAmount } = event.args
      if (!(bidder in dict) || dict[bidder].lt(bidAmount)) {
        dict[bidder] = bidAmount
      }
      return dict
    }, {})

    return Object.entries(addressToBidMap)
      .sort(([, a], [, b]) => compareBigNumber(b, a))
      .map(([bidderAddress, amount], index) => ({ bidderAddress, amount, place: index + 1 }))
  }, [bidsEvents])

  return <BidsContext.Provider value={{ bids }}>{children}</BidsContext.Provider>
}
