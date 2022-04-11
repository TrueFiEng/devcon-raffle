import { useSettledBid } from 'src/hooks/useSettledBid'

import { NoBidding } from './NoBidding'
import { WinBidFlow } from './WinBid/WinBidFlow'
import { WinOptions } from './WinBid/WinFlowEnum'

export const ClaimFlow = () => {
  const userBid = useSettledBid()

  return userBid ? <WinBidFlow userBid={userBid} win={WinOptions.Raffle} /> : <NoBidding />
}
