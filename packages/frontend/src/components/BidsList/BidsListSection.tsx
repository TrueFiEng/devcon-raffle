import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BidsList, BidsListHeaders } from 'src/components/BidsList'
import { Button } from 'src/components/Buttons/Button'
import { useAuctionWinnersCount } from 'src/hooks/useAuctionWinnersCount'
import { useBids } from 'src/hooks/useBids'
import { useUserBid } from 'src/hooks/useUserBid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

const topAuctionBidsCount = 3
const bidsMaxCount = topAuctionBidsCount + 1

export const BidsListSection = () => {
  const { bids } = useBids()
  const navigate = useNavigate()
  const userBid = useUserBid()
  const auctionWinnersCount = useAuctionWinnersCount()

  const auctionBidsSlice = useMemo(() => {
    if (auctionWinnersCount === undefined) {
      return []
    }
    if (bids.length <= bidsMaxCount) {
      return bids
    }
    const topAuctionBids = bids.slice(0, topAuctionBidsCount)
    const lastAuctionBid = bids[bids.length > auctionWinnersCount ? auctionWinnersCount - 1 : bids.length - 1]
    return userBid && within(bidsMaxCount, auctionWinnersCount - 1, userBid.place)
      ? topAuctionBids.concat([userBid, lastAuctionBid])
      : topAuctionBids.concat([lastAuctionBid])
  }, [bids, userBid, auctionWinnersCount])

  const isLoadingParams = auctionWinnersCount === undefined

  return (
    <BidsListContainer>
      {!isLoadingParams && bids.length === 0 ? (
        <EmptyList>
          <ColoredText>No bidders yet. Be the first one!</ColoredText>
        </EmptyList>
      ) : (
        <>
          <ListHeader>
            <h3>Number of participants:</h3>
            <ColoredText>{isLoadingParams ? 0 : bids.length}</ColoredText>
          </ListHeader>
          <BidsListHeaders />
          <BidsList bids={auctionBidsSlice} view="short" isLoadingParams={isLoadingParams} />
        </>
      )}
      {!isLoadingParams && bids.length !== 0 && (
        <Button view="secondary" onClick={() => navigate('/bids')}>
          Show all
        </Button>
      )}
    </BidsListContainer>
  )
}

const within = (...[lower, higher, value]: number[]) => value >= lower && value <= higher

const BidsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 32px;
  width: 100%;
  padding: 46px 0;
`

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 22px;
  width: 100%;
`

const EmptyList = styled.div`
  margin: 48px 0;
`
const ColoredText = styled.h3`
  color: ${Colors.Blue};
`
