import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { BidsSubList } from 'src/components/BidsList/BidsSubList'
import { useAuctionWinners } from 'src/hooks/useAuctionWinners'
import { useBids } from 'src/hooks/useBids'
import { useRaffleWinners } from 'src/hooks/useRaffleWinners'
import { BidWithPlace } from 'src/models/Bid'

interface SettledBidsListProps {
  search: string
}

export const SettledBidsList = ({ search }: SettledBidsListProps) => {
  const { bids } = useBids()
  const { auctionWinners } = useAuctionWinners()
  const { raffleWinners } = useRaffleWinners()

  const searchFunc = useCallback(
    (sectionBids: BidWithPlace[]) =>
      search ? sectionBids.filter((bid) => bid.bidderAddress.includes(search)) : sectionBids,
    [search]
  )

  const settledBids = useMemo(
    () => divideBids(bids, auctionWinners, raffleWinners),
    [bids, auctionWinners, raffleWinners]
  )

  const filteredBids = useMemo(() => filterBids(settledBids, searchFunc), [settledBids, searchFunc])
  const nothingFound = search && isEmpty(filteredBids)

  return (
    <>
      {nothingFound ? (
        <NothingFound search={search} />
      ) : (
        <>
          <BidsListHeaders />
          {filteredBids.auction.length !== 0 && <BidsSubList bids={filteredBids.auction} title="AUCTION" />}
          {filteredBids.raffle.length !== 0 && <BidsSubList bids={filteredBids.raffle} title="RAFFLE" />}
          {filteredBids.nonWinning.length !== 0 && <BidsSubList bids={filteredBids.nonWinning} title="NON-WINNING" />}
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

function filterBids(bids: Bids, searchFunc: (sectionBids: BidWithPlace[]) => BidWithPlace[]) {
  return {
    auction: searchFunc(bids.auction),
    raffle: searchFunc(bids.raffle),
    nonWinning: searchFunc(bids.nonWinning),
  }
}
