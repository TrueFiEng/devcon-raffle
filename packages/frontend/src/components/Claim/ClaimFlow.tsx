import { NoBidding, WinBidFlow } from 'src/components/Claim'
import { useUserBid } from 'src/hooks/useUserBid'

export const ClaimFlow = () => {
  const userBid = useUserBid()

  return userBid ? <WinBidFlow userBid={userBid} /> : <NoBidding />
}
