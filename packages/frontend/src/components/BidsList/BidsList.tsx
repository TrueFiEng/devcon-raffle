import { addressEqual } from '@usedapp/core'
import { useMemo } from 'react'
import { BidListEntry, EmptyBidListEntry } from 'src/components/BidsList/BidListEntry'
import { Separator } from 'src/components/common/Separator'
import { emptyBids } from 'src/constants/emptyBids'
import { useAuctionWinnersCount } from 'src/hooks/useAuctionWinnersCount'
import { useUserBid } from 'src/hooks/useUserBid'
import { Bid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface Props {
  bids: Bid[]
  view?: 'short' | 'full'
  isLoadingParams?: boolean
}

export const BidsList = ({ bids, view = 'full', isLoadingParams }: Props) => {
  const userBid = useUserBid()
  const auctionWinnersCount = useAuctionWinnersCount()

  const userRaffleBid = useMemo(() => {
    return auctionWinnersCount && userBid && userBid.place > auctionWinnersCount ? userBid : undefined
  }, [userBid, auctionWinnersCount])

  return (
    <>
      <BidList>
        {isLoadingParams ? (
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
      {view === 'short' && !isLoadingParams && (
        <BidListText>You’re taking part in the {userRaffleBid ? 'raffle' : 'auction'}!</BidListText>
      )}
    </>
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
const BidListText = styled.div`
  width: 100%;
  text-align: center;
  background: linear-gradient(90deg, #7ec188 0%, #65c4e8 45.31%, #7779b5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-top: -16px;
`
