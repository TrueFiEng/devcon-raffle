import { useMemo, useState } from 'react'
import { bids } from 'src/data/bids'
import type { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from '../BidsList/BidsColumns'

import { AllBidsColumns } from './AllBidsColumns'
import { BidsSubList } from './BidsSubList'
import { FilterHeaders } from './FilterHeaders'

export const AllBidsList = () => {
  const [search, setSearch] = useState('')
  const allBids: BidWithPlace[] = useMemo(
    () =>
      new Array(10)
        .fill(bids)
        .flat()
        .map((bid, index) => ({ ...bid, place: index + 1 })),
    []
  )
  const auctionBids = useMemo(() => {
    const sectionBids = allBids.length <= 20 ? allBids : allBids.slice(0, 20)
    return search ? sectionBids.filter((bid) => bid.bidderAddress.includes(search)) : sectionBids
  }, [search, allBids])
  const raffleBids = useMemo(() => {
    const sectionBids = allBids.length <= 20 ? [] : allBids.slice(20)
    return search ? sectionBids.filter((bid) => bid.bidderAddress.includes(search)) : sectionBids
  }, [search, allBids])

  return (
    <PageContainer>
      <FilterHeaders setSearch={setSearch} />
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
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  padding: 0 0 28px;
`

const SubListHeader = styled.h3`
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
`
