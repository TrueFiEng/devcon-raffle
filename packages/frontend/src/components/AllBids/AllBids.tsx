import { useState } from 'react'
import { AllBidsList } from 'src/components/AllBids/AllBidsList'
import { LoadingBids } from 'src/components/AllBids/LoadingBids'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { SearchInput } from 'src/components/Form/SearchInput'
import { useAuctionWinnersCount } from 'src/hooks/useAuctionWinnersCount'
import { useBids } from 'src/hooks/useBids'
import { useRaffleWinnersCount } from 'src/hooks/useRaffleWinnersCount'
import styled from 'styled-components'

export const AllBids = () => {
  const [search, setSearch] = useState('')

  return (
    <PageContainer>
      <SearchInput setSearch={setSearch} />
      <AllBidsContent search={search} />
    </PageContainer>
  )
}

const AllBidsContent = ({ search }: { search: string }) => {
  const auctionWinnersCount = useAuctionWinnersCount()
  const raffleWinnersCount = useRaffleWinnersCount()
  const { bids } = useBids()

  if (auctionWinnersCount === undefined || raffleWinnersCount === undefined) {
    return <LoadingBids />
  }

  if (bids.length == 0) {
    return <NothingFound />
  }

  return (
    <AllBidsList search={search} auctionWinnersCount={auctionWinnersCount} raffleWinnersCount={raffleWinnersCount} />
  )
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 20px;
  width: 100%;
  max-width: 780px;
  padding: 28px 0 56px;
`
