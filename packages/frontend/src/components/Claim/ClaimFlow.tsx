import { useSettledBid } from 'src/hooks/useSettledBid'

import { NoBidding } from './NoBidding'
import { WinBidFlow } from './WinBid/WinBidFlow'

export const ClaimFlow = () => {
  const userBid = useSettledBid()

  return userBid ? <WinBidFlow userBid={userBid} /> : <NoBidding />
}
