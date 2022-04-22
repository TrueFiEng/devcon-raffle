import { useState } from 'react'
import { AllBidsList, LoadingBids, NothingFound, SettledBidsList } from 'src/components/AllBids'
import { SearchInput } from 'src/components/Form'
import { useAuctionState, useAuctionWinnersCount, useBids, useRaffleWinnersCount } from 'src/hooks'
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
  const state = useAuctionState()
  const { bids } = useBids()

  if (auctionWinnersCount === undefined || raffleWinnersCount === undefined) {
    return <LoadingBids />
  }

  if (bids.length == 0) {
    return <NothingFound />
  }

  return (
    <>
      {state !== 'ClaimingFlow' ? (
        <AllBidsList
          search={search}
          auctionWinnersCount={auctionWinnersCount}
          raffleWinnersCount={raffleWinnersCount}
        />
      ) : (
        <SettledBidsList search={search} />
      )}
    </>
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
