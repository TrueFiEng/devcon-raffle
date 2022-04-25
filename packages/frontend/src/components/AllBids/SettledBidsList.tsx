import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { useMatchBid } from 'src/components/AllBids/useSearchBid'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { BidsSubList } from 'src/components/BidsList/BidsSubList'
import { useAuctionWinners } from 'src/hooks/useAuctionWinners'
import { useBids } from 'src/hooks/useBids'
import { useRaffleWinners } from 'src/hooks/useRaffleWinners'
import { Bid } from 'src/models/Bid'

import { GoldenTicketWinner } from '../BidsList/GoldenTicketWinner'

interface Bids {
  auction: Bid[]
  raffle: Bid[]
  others: Bid[]
  goldenTicket?: Bid
}

interface SettledBidsListProps {
  search: string
}

export const SettledBidsList = ({ search }: SettledBidsListProps) => {
  const { bids } = useBids()
  const { auctionWinners } = useAuctionWinners()
  const { raffleWinners } = useRaffleWinners()
  const matchesSearch = useMatchBid(search)

  const settledBids = useMemo(
    () => divideBids(bids, auctionWinners, raffleWinners),
    [bids, auctionWinners, raffleWinners]
  )

  const filteredBids = useMemo(() => filterBids(settledBids, matchesSearch), [settledBids, matchesSearch])

  return (
    <>
      {search && isEmpty(filteredBids) ? (
        <NothingFound search={search} />
      ) : (
        <>
          <BidsListHeaders />
          {filteredBids.goldenTicket && <GoldenTicketWinner bidderAddress={filteredBids.goldenTicket.bidderAddress} />}
          {filteredBids.auction.length !== 0 && <BidsSubList bids={filteredBids.auction} title="AUCTION" />}
          {filteredBids.raffle.length !== 0 && <BidsSubList bids={filteredBids.raffle} title="RAFFLE" />}
          {filteredBids.others.length !== 0 && <BidsSubList bids={filteredBids.others} title="OTHERS" />}
        </>
      )}
    </>
  )
}

function divideBids(bids: Bid[], auctionWinners?: BigNumber[], raffleWinners?: BigNumber[]): Bids {
  const settledBids: Bids = {
    auction: [],
    raffle: [],
    others: [],
  }

  if (!auctionWinners || !raffleWinners) {
    return settledBids
  }

  settledBids.goldenTicket = bids.find((b) => b.bidderID.eq(raffleWinners[0]))

  settledBids.others = bids.filter((bid) => {
    if (includesBigNumber(auctionWinners, bid.bidderID)) {
      settledBids.auction.push(bid)
      return false
    }
    if (includesBigNumber(raffleWinners, bid.bidderID)) {
      if (!settledBids.goldenTicket?.bidderID.eq(bid.bidderID)) {
        settledBids.raffle.push(bid)
      }
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

function filterBids(bids: Bids, matchesSearch: (bid: Bid) => boolean) {
  return {
    auction: bids.auction.filter(matchesSearch),
    raffle: bids.raffle.filter(matchesSearch),
    others: bids.others.filter(matchesSearch),
    goldenTicket: bids.goldenTicket && matchesSearch(bids.goldenTicket) ? bids.goldenTicket : undefined,
  }
}

function isEmpty(bids: Bids) {
  return bids.auction.length === 0 && bids.raffle.length === 0 && bids.others.length === 0 && !bids.goldenTicket
}
