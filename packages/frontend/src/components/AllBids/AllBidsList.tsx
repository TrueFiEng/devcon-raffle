import { useEffect, useMemo, useState } from 'react'
import { useBidEvents } from 'src/hooks/useBidEvents'
import type { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from '../BidsList/BidsColumns'

import { AllBidsColumns } from './AllBidsColumns'
import { BidsSubList } from './BidsSubList'
import { FilterHeaders } from './FilterHeaders'
import { NothingFound } from './NothingFound'

export const AllBidsList = () => {
  useBidEvents()
  const [search, setSearch] = useState('')
  const bids = useBidEvents()
  const [allBids, setAllBids] = useState<BidWithPlace[]>([])
  const a = async () => await bids.then((bids) => setAllBids(bids.map((b, i) => ({ ...b, place: i + 1 }))))
  useEffect(() => {
    a()
  }, [])
  const auctionBids = useMemo(() => {
    const sectionBids = allBids.length <= 20 ? allBids : allBids.slice(0, 20)
    return search ? sectionBids.filter((bid) => bid.bidderAddress.includes(search)) : sectionBids
  }, [search, allBids])
  const raffleBids = useMemo(() => {
    const sectionBids = allBids.length <= 20 ? [] : allBids.slice(20)
    return search ? sectionBids.filter((bid) => bid.bidderAddress.includes(search)) : sectionBids
  }, [search, allBids])
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
