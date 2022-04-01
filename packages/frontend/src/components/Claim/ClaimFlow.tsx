import { useUserBid } from 'src/hooks/useUserBid'

import { NoBidding } from './NoBidding'
import { WinBidFlow } from './WinBid/WinBidFlow'

export const ClaimFlow = () => {
  const userBid = useUserBid()

  return userBid ? <WinBidFlow userBid={userBid} /> : <NoBidding />
}
