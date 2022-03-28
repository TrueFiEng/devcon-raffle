import { addressEqual } from '@usedapp/core'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'src/components/Buttons'
import { AUCTION_PARTICIPANTS_COUNT } from 'src/constants/auctionParticipantsCount'
import { useBids } from 'src/hooks/useBids'
import { useUserBid } from 'src/hooks/useUserBid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { AddressColumn, BidColumn, BidsColumns, PlaceColumn } from './BidsColumns'
import { BidsListEntry } from './BidsListEntry'

export const BidsListSection = () => {
  const { bids } = useBids()
  const navigate = useNavigate()
  const userBid = useUserBid()

  const { auctionBidsSlice, userRaffleBid } = useMemo(() => {
    if (bids.length <= 4) {
      return {
        auctionBidsSlice: bids,
      }
    }
    const topAuctionBids = bids.slice(0, 3)
    const lastAuctionBid =
      bids[bids.length > AUCTION_PARTICIPANTS_COUNT ? AUCTION_PARTICIPANTS_COUNT - 1 : bids.length - 1]
    return {
      auctionBidsSlice:
        userBid && within(4, AUCTION_PARTICIPANTS_COUNT - 1, userBid.place)
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
      <BidsHeaders>
        <PlaceColumn>Place</PlaceColumn>
        <BidColumn>Bid</BidColumn>
        <AddressColumn>Address</AddressColumn>
      </BidsHeaders>
      <BidsList>
        {auctionBidsSlice.map((bid) => (
          <BidsListEntry
            key={bid.bidderAddress}
            bid={bid}
            isUser={userBid && addressEqual(userBid.bidderAddress, bid.bidderAddress)}
          />
        ))}
        {userRaffleBid && <BidsListEntry bid={userRaffleBid} isUser />}
      </BidsList>
      <ButtonRow>
        <Button view="secondary" onClick={() => navigate('/bids')}>
          Show all
        </Button>
      </ButtonRow>
    </BidsListContainer>
  )
}

const within = (...[lower, higher, value]: number[]) => value >= lower && value <= higher

const BidsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 46px 0;
`

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
`
const ColoredNumber = styled.h3`
  color: ${Colors.Blue};
`

const BidsHeaders = styled.div`
  ${BidsColumns};
  padding-top: 50px;
  font-weight: 600;
  color: ${Colors.Black};
`
const BidsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 32px 0;
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
`
