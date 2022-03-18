import { useMemo, useState } from 'react'
import { bids } from 'src/data/bids'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { AddressColumn, BidColumn, PlaceColumn } from '../BidsList/BidsColumns'

import { AllBidsColumns } from './AllBidsColumns'
import { BidsSubList } from './BidsSubList'
import { FilterHeaders } from './FilterHeaders'

export type DisplayMode = 'All' | 'Auction' | 'Raffle'

export const AllBidsList = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('All')
  const [search, setSearch] = useState('')
  const auctionBids = useMemo(
    () => (search ? bids.filter((bid) => bid.bidderAddress.includes(search)) : bids),
    [search]
  )
  const raffleBids = useMemo(() => (search ? bids.filter((bid) => bid.bidderAddress.includes(search)) : bids), [search])

  return (
    <PageContainer>
      <FilterHeaders {...{ setDisplayMode, setSearch }} />
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
      {['All', 'Auction'].includes(displayMode) && (
        <>
          <TitleBanner>
            <SubListHeader>AUCTION</SubListHeader>
          </TitleBanner>
          <BidsSubList bids={auctionBids} />
        </>
      )}
      {['All', 'Raffle'].includes(displayMode) && (
        <>
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
