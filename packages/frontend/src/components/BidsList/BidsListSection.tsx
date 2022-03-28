import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BidListEntry } from 'src/components/BidsList/BidListEntry'
import { BidsList } from 'src/components/BidsList/BidsList'
import { BidsListHeaders } from 'src/components/BidsList/BidsListHeaders'
import { Button } from 'src/components/Buttons/Button'
import { AUCTION_PARTICIPANTS_COUNT } from 'src/constants/auctionParticipantsCount'
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

  const { auctionBidsSlice, userRaffleBid } = useMemo(() => {
    if (bids.length <= bidsMaxCount) {
      return {
        auctionBidsSlice: bids,
      }
    }
    const topAuctionBids = bids.slice(0, topAuctionBidsCount)
    const lastAuctionBid =
      bids[bids.length > AUCTION_PARTICIPANTS_COUNT ? AUCTION_PARTICIPANTS_COUNT - 1 : bids.length - 1]
    return {
      auctionBidsSlice:
        userBid && within(bidsMaxCount, AUCTION_PARTICIPANTS_COUNT - 1, userBid.place)
          ? topAuctionBids.concat([userBid, lastAuctionBid])
          : topAuctionBids.concat([lastAuctionBid]),
      userRaffleBid: userBid && userBid.place > AUCTION_PARTICIPANTS_COUNT ? userBid : undefined,
    }
  }, [bids, userBid])

  return (
    <BidsListContainer>
      <ListHeader>
        <h3>Number of participants:</h3>
        <ColoredNumber>{bids.length}</ColoredNumber>
      </ListHeader>
      <BidsListHeaders />
      <BidsList bids={auctionBidsSlice} view="short" />
      {userRaffleBid && <BidListEntry bid={userRaffleBid} isUser />}
      <Button view="secondary" onClick={() => navigate('/bids')}>
        Show all
      </Button>
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
const ColoredNumber = styled.h3`
  color: ${Colors.Blue};
`
