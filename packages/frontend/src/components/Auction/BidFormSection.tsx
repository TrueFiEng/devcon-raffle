import { parseEther } from '@ethersproject/units'
import { bids } from 'src/data/bids'
import { useAuctionStatus } from 'src/hooks/useAuctionStatus'

import { BidForm } from './BidForm'
import { ConnectWalletWarning } from './ConnectWalletWarning'

export const BidFormSection = () => {
  const status = useAuctionStatus()

  if (status === 'NotConnected') {
    return <ConnectWalletWarning />
  }
  return <BidForm minimumBid={parseEther('0.15')} bids={bids} />
}
