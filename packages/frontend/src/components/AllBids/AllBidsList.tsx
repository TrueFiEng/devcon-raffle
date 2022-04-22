import { useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { useMatchBid } from 'src/components/AllBids/useSearchBid'
import { BidsListHeaders, BidsSubList } from 'src/components/BidsList'
import { useBids } from 'src/hooks/useBids'

interface AllBidsListProps {
  search: string
  auctionWinnersCount: number
  raffleWinnersCount: number
}

export const AllBidsList = ({ search, auctionWinnersCount, raffleWinnersCount }: AllBidsListProps) => {
  const { bids } = useBids()
  const matchesSearch = useMatchBid(search)

  const raffleBidsOffset = Math.max(0, bids.length - raffleWinnersCount)
  const firstRaffleBidIndex = raffleBidsOffset >= auctionWinnersCount ? auctionWinnersCount : raffleBidsOffset

  const auctionBids = useMemo(() => {
    const sectionBids = bids.slice(0, firstRaffleBidIndex)
    return sectionBids.filter(matchesSearch)
  }, [bids, matchesSearch]) // eslint-disable-line react-hooks/exhaustive-deps
  const raffleBids = useMemo(() => {
    const sectionBids = bids.slice(firstRaffleBidIndex)
    return sectionBids.filter(matchesSearch)
  }, [bids, matchesSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const nothingFound = search && auctionBids.length === 0 && raffleBids.length === 0

  return (
    <>
      {nothingFound ? (
        <NothingFound search={search} />
      ) : (
        <>
          <BidsListHeaders />
          {auctionBids.length !== 0 && <BidsSubList bids={auctionBids} title="AUCTION" />}
          {raffleBids.length !== 0 && <BidsSubList bids={raffleBids} title="RAFFLE" />}
        </>
      )}
    </>
  )
}
