import { emptyBids } from 'src/constants/emptyBids'

import { EmptyBidListEntry } from './BidListEntry'
import { BidList } from './BidsList'

export const EmptyBidsList = () => {
  return (
    <BidList>
      {emptyBids.map((emptyBid) => (
        <EmptyBidListEntry key={emptyBid} place={emptyBid} />
      ))}
    </BidList>
  )
}
