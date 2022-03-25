import { useMemo, useState } from 'react'
import { useBids } from 'src/hooks/useBids'
import { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from '../BidsList/BidsColumns'

import { AllBidsColumns } from './AllBidsColumns'
import { BidsSubList } from './BidsSubList'
import { FilterHeaders } from './FilterHeaders'
import { NothingFound } from './NothingFound'

export const AllBidsList = () => {
  const [search, setSearch] = useState('')
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
  const noBids = !auctionBids && !raffleBids
  const nothingFound = search && noBids

  return (
    <PageContainer>
      <FilterHeaders setSearch={setSearch} />
      {nothingFound ? (
        <NothingFound search={search} />
      ) : noBids ? (
        <NothingFound />
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
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 20px;
  width: 780px;
  max-width: 780px;
  padding: 28px 0;
`

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
