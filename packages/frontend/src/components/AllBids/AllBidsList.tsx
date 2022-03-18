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
            <h3>AUCTION</h3>
          </TitleBanner>
          <BidsSubList bids={auctionBids} />
        </>
      )}
      {['All', 'Raffle'].includes(displayMode) && (
        <>
          <TitleBanner>
            <h3>RAFFLE</h3>
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
  justify-content: start;
  width: 778px;
  max-width: 778px;
  padding: 28px 0 100px;
`

const TitleBanner = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 39;
  background-color: ${Colors.BlueLight};
`

const BidsHeaders = styled.div`
  ${AllBidsColumns};
  padding: 0 0 28px;
`
