import { useCall } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { ZERO } from 'src/constants/bigNumber'
import { Bid } from 'src/models/Bid'

import { useDevconContract } from './contract'

export function useContractBids() {
  const [bids, setBids] = useState<Bid[]>([])

  const fetchedBids = useBidsWithAddresses()
  const totalAmountAsString = fetchedBids.reduce((totalAmount, bid) => totalAmount.add(bid.amount), ZERO).toString()

  useEffect(() => {
    setBids(fetchedBids)
  }, [totalAmountAsString]) // eslint-disable-line react-hooks/exhaustive-deps

  return bids
}

function useBidsWithAddresses(): Bid[] {
  const devconContract = useDevconContract()

  const { value } =
    useCall(
      devconContract && {
        contract: devconContract,
        method: 'getBidsWithAddresses',
        args: [],
      }
    ) ?? {}

  const bids: Bid[] = []

  if (value && value?.[0]?.length > 0) {
    value[0].forEach((fetchedBid) => {
      bids.push({
        bidderID: fetchedBid.bid.bidderID,
        bidderAddress: fetchedBid.bidder,
        amount: fetchedBid.bid.amount,
      })
    })
  }

  return bids
}
