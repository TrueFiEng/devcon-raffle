import { useCallback, useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { BidsSubList } from 'src/components/BidsList/BidsSubList'
import { AUCTION_PARTICIPANTS_COUNT } from 'src/constants/auctionParticipantsCount'
import { RAFFLE_PARTICIPANTS_COUNT } from 'src/constants/raffleParticipantsCount'
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

  const raffleBidsOffset = Math.max(0, bids.length - RAFFLE_PARTICIPANTS_COUNT)
  const firstRaffleBidIndex =
    raffleBidsOffset >= AUCTION_PARTICIPANTS_COUNT ? AUCTION_PARTICIPANTS_COUNT : raffleBidsOffset

  const auctionBids = useMemo(() => {
    const sectionBids = bids.length <= RAFFLE_PARTICIPANTS_COUNT ? [] : bids.slice(0, firstRaffleBidIndex)
    return search ? searchBid(sectionBids) : sectionBids
  }, [search, bids, searchBid, firstRaffleBidIndex])
  const raffleBids = useMemo(() => {
    const sectionBids = bids.length > RAFFLE_PARTICIPANTS_COUNT ? bids.slice(firstRaffleBidIndex) : bids
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
