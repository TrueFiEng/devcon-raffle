import { useUserBid } from 'src/hooks/useUserBid'

import { NoBidding } from './NoBidding'
import { WinBidFlow } from './WinBid/WinBidFlow'
import { WinOptions } from './WinBid/WinFlowEnum'

export const ClaimFlow = () => {
  const userBid = useUserBid()

  return userBid ? <WinBidFlow userBid={userBid} win={WinOptions.Raffle} /> : <NoBidding />
}
