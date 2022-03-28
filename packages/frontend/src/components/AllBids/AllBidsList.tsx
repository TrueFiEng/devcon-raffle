import { useCallback, useMemo } from 'react'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { BidsList } from 'src/components/BidsList/BidsList'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { AUCTION_PARTICIPANTS_COUNT } from 'src/constants/auctionParticipantsCount'
import { useBids } from 'src/hooks/useBids'
import { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

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
          {auctionBids && (
            <>
              <TitleBanner>
                <SubListHeader>AUCTION</SubListHeader>
              </TitleBanner>
              <BidsList bids={auctionBids} />
            </>
          )}
          {raffleBids && (
            <>
              <TitleBanner>
                <SubListHeader>RAFFLE</SubListHeader>
              </TitleBanner>
              <BidsList bids={raffleBids} />
            </>
          )}
        </>
      )}
    </>
  )
}

const TitleBanner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4px 0;
  background-color: ${Colors.GreenLight};
`

const SubListHeader = styled.h3`
  font-size: 20px;
  line-height: 150%;
`
