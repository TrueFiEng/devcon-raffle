import { useCallback, useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { BidsSubList } from 'src/components/BidsList/BidsSubList'
import { useAuctionParticipants } from 'src/hooks/useAuctionParticipants'
import { useBids } from 'src/hooks/useBids'
import { useRaffleParticipants } from 'src/hooks/useRaffleParticipants'
import { BidWithPlace } from 'src/models/Bid'

interface AllBidsListProps {
  search: string
}

export const AllBidsList = ({ search }: AllBidsListProps) => {
  const { bids } = useBids()
  const raffleParticipants = useRaffleParticipants()
  const auctionParticipants = useAuctionParticipants()

  const searchBid = useCallback(
    (sectionBids: BidWithPlace[]) => sectionBids.filter((bid) => bid.bidderAddress.includes(search)),
    [search]
  )

  const raffleBidsOffset = Math.max(0, bids.length - raffleParticipants)
  const firstRaffleBidIndex = raffleBidsOffset >= auctionParticipants ? auctionParticipants : raffleBidsOffset

  const auctionBids = useMemo(() => {
    const sectionBids = bids.slice(0, firstRaffleBidIndex)
    return search ? searchBid(sectionBids) : sectionBids
  }, [search, bids, searchBid]) // eslint-disable-line react-hooks/exhaustive-deps
  const raffleBids = useMemo(() => {
    const sectionBids = bids.slice(firstRaffleBidIndex)
    return search ? searchBid(sectionBids) : sectionBids
  }, [search, bids, searchBid]) // eslint-disable-line react-hooks/exhaustive-deps

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
