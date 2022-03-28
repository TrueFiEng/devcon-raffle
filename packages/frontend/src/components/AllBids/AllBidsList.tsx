import { useCallback, useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { BidsSubList } from 'src/components/BidsList/BidsSubList'
import { AUCTION_PARTICIPANTS_COUNT } from 'src/constants/auctionParticipantsCount'
import { useBids } from 'src/hooks/useBids'
import { BidWithPlace } from 'src/models/Bid'

interface AllBidsListProps {
  search: string
}

export const AllBidsList = ({ search }: AllBidsListProps) => {
  const { bids } = useBids()

  const searchBid = useCallback(
    (sectionBids: BidWithPlace[]) => sectionBids.filter((bid) => bid.bidderAddress.includes(search)),
    [search]
  )

  const auctionBids = useMemo(() => {
    const sectionBids = bids.length <= AUCTION_PARTICIPANTS_COUNT ? bids : bids.slice(0, AUCTION_PARTICIPANTS_COUNT)
    return search ? searchBid(sectionBids) : sectionBids
  }, [search, bids, searchBid])
  const raffleBids = useMemo(() => {
    const sectionBids = bids.length <= AUCTION_PARTICIPANTS_COUNT ? [] : bids.slice(AUCTION_PARTICIPANTS_COUNT)
    return search ? searchBid(sectionBids) : sectionBids
  }, [search, bids, searchBid])
  const nothingFound = search && auctionBids.length === 0 && raffleBids.length === 0

  return (
    <>
      {nothingFound ? (
        <NothingFound search={search} />
      ) : (
        <>
          <BidsListHeaders />
          {auctionBids && <BidsSubList bids={auctionBids} title="AUCTION" />}
          {raffleBids && <BidsSubList bids={raffleBids} title="RAFFLE" />}
        </>
      )}
    </>
  )
}
