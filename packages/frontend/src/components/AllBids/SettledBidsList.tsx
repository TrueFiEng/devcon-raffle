import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { useSearchBid } from 'src/components/AllBids/useSearchBid'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { BidsSubList } from 'src/components/BidsList/BidsSubList'
import { useAuctionWinners } from 'src/hooks/useAuctionWinners'
import { useBids } from 'src/hooks/useBids'
import { useRaffleWinners } from 'src/hooks/useRaffleWinners'
import { Bid } from 'src/models/Bid'
import { ImmutableBids } from 'src/providers/Bids/types'

interface Bids {
  auction: Bid[]
  raffle: Bid[]
  others: Bid[]
}

interface SettledBidsListProps {
  search: string
}

export const SettledBidsList = ({ search }: SettledBidsListProps) => {
  const { bids } = useBids()
  const { auctionWinners } = useAuctionWinners()
  const { raffleWinners } = useRaffleWinners()
  const searchFunc = useSearchBid(search)

  const settledBids = useMemo(
    () => divideBids(bids, auctionWinners, raffleWinners),
    [bids, auctionWinners, raffleWinners]
  )

  const filteredBids = useMemo(() => filterBids(settledBids, searchFunc), [settledBids, searchFunc])

  return (
    <>
      {search && isEmpty(filteredBids) ? (
        <NothingFound search={search} />
      ) : (
        <>
          <BidsListHeaders />
          {filteredBids.auction.length !== 0 && <BidsSubList bids={filteredBids.auction} title="AUCTION" />}
          {filteredBids.raffle.length !== 0 && <BidsSubList bids={filteredBids.raffle} title="RAFFLE" />}
          {filteredBids.others.length !== 0 && <BidsSubList bids={filteredBids.others} title="OTHERS" />}
        </>
      )}
    </>
  )
}

function divideBids(bids: ImmutableBids, auctionWinners?: BigNumber[], raffleWinners?: BigNumber[]): Bids {
  const settledBids: Bids = {
    auction: [],
    raffle: [],
    others: [],
  }

  if (!auctionWinners || !raffleWinners) {
    return settledBids
  }

  bids.forEach((bid) => {
    if (includesBigNumber(auctionWinners, bid.get('bidderID'))) {
      settledBids.auction.push(bid.toObject())
      return
    }
    if (includesBigNumber(raffleWinners, bid.get('bidderID'))) {
      settledBids.raffle.push(bid.toObject())
      return
    }
    settledBids.others.push(bid.toObject())
  })
  return settledBids
}

function includesBigNumber(array: BigNumber[], searchElement: BigNumber) {
  for (const element of array) {
    if (element.eq(searchElement)) return true
  }
  return false
}

function filterBids(bids: Bids, searchFunc: (sectionBids: Bid[]) => Bid[]) {
  return {
    auction: searchFunc(bids.auction),
    raffle: searchFunc(bids.raffle),
    others: searchFunc(bids.others),
  }
}

function isEmpty(bids: Bids) {
  return bids.auction.length === 0 && bids.raffle.length === 0 && bids.others.length === 0
}
