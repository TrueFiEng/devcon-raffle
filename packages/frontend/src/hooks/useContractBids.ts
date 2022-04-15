import { useCall } from '@usedapp/core'
import { useMemo } from 'react'
import { ZERO } from 'src/constants/bigNumber'
import { Bid } from 'src/models/Bid'

import { useDevconContract } from './contract'

export function useContractBids() {
  const fetchedBids = useBidsWithAddresses()
  const totalAmountAsString = fetchedBids.reduce((totalAmount, bid) => totalAmount.add(bid.amount), ZERO).toString()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => fetchedBids, [totalAmountAsString])
}

function useBidsWithAddresses(): Bid[] {
  const { devcon } = useDevconContract()

  const { value } =
    useCall(
      devcon && {
        contract: devcon,
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
        place: -1,
      })
    })
  }

  return bids
}
