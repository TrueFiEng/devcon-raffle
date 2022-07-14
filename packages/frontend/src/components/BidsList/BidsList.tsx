import { addressEqual } from '@usedapp/core'
import { useMemo } from 'react'
import { BidListEntry } from 'src/components/BidsList/BidListEntry'
import { EmptyBidsList } from 'src/components/BidsList/EmptyBidsList'
import { Separator } from 'src/components/common/Separator'
import { ContractState, useBids, useContractState, useRaffleWinnersCount } from 'src/hooks'
import { useAuctionWinnersCount } from 'src/hooks/useAuctionWinnersCount'
import { useUserBid } from 'src/hooks/useUserBid'
import { Bid, UserBid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import { getFirstRaffleBidIndex } from 'src/utils'
import styled from 'styled-components'

interface Props {
  bids: Bid[]
  view?: 'short' | 'full'
  isLoadingParams?: boolean
  showBidderID?: boolean
}

export const BidsList = ({ bids, view = 'full', isLoadingParams, showBidderID }: Props) => {
  const userBid = useUserBid()
  const auctionWinnersCount = useAuctionWinnersCount()
  const raffleWinnersCount = useRaffleWinnersCount()
  const { bids: allBids } = useBids()
  const { state } = useContractState()

  const userRaffleBid = useMemo(() => {
    return auctionWinnersCount && userBid && userBid.place > auctionWinnersCount ? userBid : undefined
  }, [userBid, auctionWinnersCount])

  const isAuctionWinner = useMemo(() => {
    return isAuctionParticipant(userBid, auctionWinnersCount, raffleWinnersCount, allBids.size)
  }, [auctionWinnersCount, allBids.size, raffleWinnersCount, userBid])

  if (isLoadingParams) {
    return <EmptyBidsList />
  }

  return (
    <>
      <BidList>
        {bids.map((bid) => (
          <BidListEntry
            key={bid.bidderAddress}
            bid={bid}
            isUser={userBid && addressEqual(userBid.bidderAddress, bid.bidderAddress)}
            view={view}
            showBidderID={showBidderID}
          />
        ))}
        {userRaffleBid && view === 'short' && (
          <>
            <Separator color={Colors.Grey} />
            <BidListEntry bid={userRaffleBid} isUser view={view} />
          </>
        )}
      </BidList>
      {view === 'short' && userBid && !isAuctionSettled(state) && (
        <BidListText>You’re taking part in the {isAuctionWinner ? 'auction' : 'raffle'}!</BidListText>
      )}
    </>
  )
}

function isAuctionParticipant(
  userBid: UserBid | undefined,
  auctionWinnersCount: number | undefined,
  raffleWinnersCount: number | undefined,
  bidsLength: number
) {
  if (!userBid || !raffleWinnersCount || !auctionWinnersCount) {
    return false
  }
  const firstRaffleBidIndex = getFirstRaffleBidIndex(bidsLength, auctionWinnersCount, raffleWinnersCount)
  return userBid.place <= firstRaffleBidIndex
}

function isAuctionSettled(state: ContractState) {
  return (
    state === ContractState.AUCTION_SETTLED ||
    state === ContractState.RAFFLE_SETTLED ||
    state === ContractState.CLAIMING_CLOSED
  )
}

export const BidList = styled.div`
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
