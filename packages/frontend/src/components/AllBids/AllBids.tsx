import { useState } from 'react'
import { AllBidsList } from 'src/components/AllBids/AllBidsList'
import { NothingFound } from 'src/components/AllBids/NothingFound'
import { SearchInput } from 'src/components/Form/SearchInput'
import { useAuctionWinnersCount } from 'src/hooks/useAuctionWinnersCount'
import { useBids } from 'src/hooks/useBids'
import { useRaffleWinnersCount } from 'src/hooks/useRaffleWinnersCount'
import styled from 'styled-components'

export const AllBids = () => {
  const [search, setSearch] = useState('')
  const auctionWinnersCount = useAuctionWinnersCount()
  const raffleWinnersCount = useRaffleWinnersCount()
  const { bids } = useBids()
  const noBids = bids.length === 0 || auctionWinnersCount === undefined || raffleWinnersCount === undefined

  return (
    <PageContainer>
      <SearchInput setSearch={setSearch} />
      {noBids ? (
        <NothingFound />
      ) : (
        <AllBidsList
          search={search}
          auctionWinnersCount={auctionWinnersCount}
          raffleWinnersCount={raffleWinnersCount}
        />
      )}
    </PageContainer>
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
