import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { BidsSubList } from 'src/components/BidsList/BidsSubList'
import { useBids } from 'src/hooks/useBids'
import { BidWithPlace } from 'src/models/Bid'

import { useAuctionWinners } from '../../hooks/useAuctionWinners'
import { useRaffleWinners } from '../../hooks/useRaffleWinners'

interface SettledBidsListProps {
  search: string
}

export const SettledBidsList = ({ search }: SettledBidsListProps) => {
  const { bids } = useBids()
  const { auctionWinners } = useAuctionWinners()
  const { raffleWinners } = useRaffleWinners()

  const settledBids = useMemo(() => {
    console.log('useMemo: divideBids')
    return divideBids(bids, auctionWinners, raffleWinners)
  }, [bids, auctionWinners, raffleWinners])

  const nothingFound = search && isEmpty(settledBids)
  return (
    <>
      {nothingFound ? (
        <NothingFound search={search} />
      ) : (
        <>
          <BidsListHeaders />
          {settledBids.auction.length !== 0 && <BidsSubList bids={settledBids.auction} title="AUCTION" />}
          {settledBids.raffle.length !== 0 && <BidsSubList bids={settledBids.raffle} title="RAFFLE" />}
          {settledBids.nonWinning.length !== 0 && <BidsSubList bids={settledBids.nonWinning} title="NON-WINNING" />}
        </>
      )}
    </>
  )
}

interface Bids {
  auction: BidWithPlace[]
  raffle: BidWithPlace[]
  nonWinning: BidWithPlace[]
}

function divideBids(bids: BidWithPlace[], auctionWinners?: BigNumber[], raffleWinners?: BigNumber[]): Bids {
  const settledBids: Bids = {
    auction: [],
    raffle: [],
    nonWinning: [],
  }

  if (!auctionWinners || !raffleWinners) {
    return settledBids
  }

  settledBids.nonWinning = bids.filter((bid) => {
    if (includesBigNumber(auctionWinners, bid.bidderID)) {
      settledBids.auction.push(bid)
      return false
    }
    if (includesBigNumber(raffleWinners, bid.bidderID)) {
      settledBids.raffle.push(bid)
      return false
    }
    return true
  })
  return settledBids
}

function includesBigNumber(array: BigNumber[], searchElement: BigNumber) {
  for (const element of array) {
    if (element.eq(searchElement)) return true
  }
  return false
}

function isEmpty(bids: Bids) {
  return bids.auction.length === 0 && bids.raffle.length === 0 && bids.nonWinning.length === 0
}
