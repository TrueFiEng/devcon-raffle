import { useUserBid } from '../../hooks/useUserBid'
import { NoBidding } from '../Bid/NoBidding'
import { WinBidFlow } from '../Bid/WinBid/WinBidFlow'

export const ClaimFlow = () => {
  const userBid = useUserBid()

  return userBid ? <WinBidFlow userBid={userBid} /> : <NoBidding />
}
