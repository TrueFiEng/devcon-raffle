import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { Bid } from 'src/models/Bid'

import { useDevconContract } from './contract'
import { useCachedCall } from './useCachedCall'

interface BidWithAddress {
  bidder: string;
  bid: {
    bidderID: BigNumber;
    amount: BigNumber;
    winType: number;
    claimed: boolean;
  };
}

export function useContractBids(): Bid[] {
  const { devcon, chainId } = useDevconContract()

  const { value } =
    useCachedCall({
        contract: devcon,
        method: 'getBidsWithAddresses',
        args: [],
      },
      chainId
    ) ?? {}

  const bids = value && value[0] as BidWithAddress[]

  return useMemo(() => {
      return bids?.map((fetchedBid) => ({
        bidderID: fetchedBid.bid.bidderID,
        bidderAddress: fetchedBid.bidder,
        amount: fetchedBid.bid.amount,
        place: -1,
      })) ?? []
  }, [bids])
}
