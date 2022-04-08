import { addressEqual } from '@usedapp/core'
import { useMemo } from 'react'
import { BidListEntry, EmptyBidListEntry } from 'src/components/BidsList/BidListEntry'
import { Separator } from 'src/components/common/Separator'
import { emptyBids } from 'src/constants/emptyBids'
import { useAuctionParticipants } from 'src/hooks/useAuctionParticipants'
import { useUserBid } from 'src/hooks/useUserBid'
import { BidWithPlace } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface Props {
  bids: BidWithPlace[]
  view?: 'short' | 'full'
}

export const BidsList = ({ bids, view = 'full' }: Props) => {
  const userBid = useUserBid()
  const auctionParticipants = useAuctionParticipants()

  const userRaffleBid = useMemo(() => {
    return userBid && userBid.place > auctionParticipants ? userBid : undefined
  }, [userBid, auctionParticipants])

  return (
    <BidList>
      {bids.length === 0 ? (
        emptyBids.map((emptyBid) => <EmptyBidListEntry key={emptyBid} place={emptyBid} />)
      ) : (
        <>
          {bids.map((bid) => (
            <BidListEntry
              key={bid.bidderAddress}
              bid={bid}
              isUser={userBid && addressEqual(userBid.bidderAddress, bid.bidderAddress)}
              view={view}
            />
          ))}
          {userRaffleBid && view === 'short' && (
            <>
              <Separator color={Colors.Grey} />
              <BidListEntry bid={userRaffleBid} isUser view={view} />
            </>
          )}
        </>
      )}
    </BidList>
  )
}

const BidList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  width: 100%;
  margin: 0;
  padding: 0;
`
