import { useMemo, useState } from 'react'
import { useBids } from 'src/hooks/useBids'
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
  const auctionBids = useMemo(() => {
    const sectionBids = bids.length <= 20 ? bids : bids.slice(0, 20)
    return search ? sectionBids.filter((bid) => bid.bidderAddress.includes(search)) : sectionBids
  }, [search, bids])
  const raffleBids = useMemo(() => {
    const sectionBids = bids.length <= 20 ? [] : bids.slice(20)
    return search ? sectionBids.filter((bid) => bid.bidderAddress.includes(search)) : sectionBids
  }, [search, bids])
  const nothingFound = search && auctionBids.length === 0 && raffleBids.length === 0

  return (
    <PageContainer>
      <FilterHeaders setSearch={setSearch} />
      {nothingFound ? (
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
          <TitleBanner>
            <SubListHeader>AUCTION</SubListHeader>
          </TitleBanner>
          <BidsSubList bids={auctionBids} />
          <TitleBanner>
            <SubListHeader>RAFFLE</SubListHeader>
          </TitleBanner>
          <BidsSubList bids={raffleBids} />
        </>
      )}
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  width: 780px;
  max-width: 780px;
  padding: 28px 0;
`

const TitleBanner = styled.div`
  display: flex;
  justify-content: space-around;
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
