import { addressEqual } from '@usedapp/core'
import { BidListEntry } from 'src/components/BidsList/BidListEntry'
import { useUserBid } from 'src/hooks/useUserBid'
import { BidWithPlace } from 'src/models/Bid'
import styled from 'styled-components'

interface Props {
  bids: BidWithPlace[]
  view?: 'short' | 'full'
}

export const BidsList = ({ bids, view = 'full' }: Props) => {
  const userBid = useUserBid()

  return (
    <BidList>
      {bids.map((bid) => (
        <BidListEntry
          key={bid.bidderAddress}
          bid={bid}
          isUser={userBid && addressEqual(userBid.bidderAddress, bid.bidderAddress)}
          view={view}
        />
      ))}
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
