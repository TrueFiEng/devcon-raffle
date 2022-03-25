import { useMemo } from 'react'
import { useBids } from 'src/hooks/useBids'
import { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from '../BidsList/BidsColumns'

import { AllBidsColumns } from './AllBidsColumns'
import { BidsSubList } from './BidsSubList'
import { NothingFound } from './NothingFound'

interface AllBidsListProps {
  search: string
}

export const AllBidsList = ({ search }: AllBidsListProps) => {
  const { bids } = useBids()

  const searchBid = (sectionBids: BidWithPlace[]) => sectionBids.filter((bid) => bid.bidderAddress.includes(search))

  const auctionBidsList = useMemo(() => {
    const sectionBids = bids.length <= 20 ? bids : bids.slice(0, 20)
    return search ? searchBid(sectionBids) : sectionBids
  }, [search, bids])

  const raffleBidsList = useMemo(() => {
    const sectionBids = bids.length <= 20 ? [] : bids.slice(20)
    return search ? searchBid(sectionBids) : sectionBids
  }, [search, bids])

  const auctionBids = auctionBidsList.length !== 0
  const raffleBids = raffleBidsList.length !== 0
  const nothingFound = search && !auctionBids && !raffleBids

  return (
    <>
      {nothingFound ? (
        <NothingFound search={search} />
      ) : (
        <>
          <BidsHeaders>
            <PlaceColumn>
              <b>Place</b>
            </PlaceColumn>
            <BidColumn>
              <b>Bid</b>
            </BidColumn>
            <AddressColumn>
              <b>Address</b>
            </AddressColumn>
          </BidsHeaders>
          {auctionBids && (
            <>
              <TitleBanner>
                <SubListHeader>AUCTION</SubListHeader>
              </TitleBanner>
              <BidsSubList bids={auctionBidsList} />
            </>
          )}
          {raffleBids && (
            <>
              <TitleBanner>
                <SubListHeader>RAFFLE</SubListHeader>
              </TitleBanner>
              <BidsSubList bids={raffleBidsList} />
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
  height: 40px;
  background-color: ${Colors.GreenLight};
`

const BidsHeaders = styled.div`
  ${AllBidsColumns};
`

const SubListHeader = styled.h3`
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
`
