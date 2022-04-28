import { useEffect, useState } from 'react'
import { BumpBidFlow } from 'src/components/Bid/BumpBid/BumpBidFlow'
import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { useUserBid } from 'src/hooks/useUserBid'

export const BidFlow = () => {
  const userBid = useUserBid()
  const [isTransactionViewLock, setTransactionViewLock] = useState(false)

  const [isInitialBid, setIsInitialBid] = useState<boolean>(true)
  useEffect(() => {
    if (!isTransactionViewLock) {
      setIsInitialBid(!userBid)
    }
  }, [isTransactionViewLock, !userBid]) // eslint-disable-line react-hooks/exhaustive-deps

  return isInitialBid ? (
    <PlaceBidFlow setTransactionViewLock={setTransactionViewLock} />
  ) : (
    <BumpBidFlow setTransactionViewLock={setTransactionViewLock} />
  )
}

export interface FlowProps {
  setTransactionViewLock: (value: boolean) => void
}
type BidFlow = (props: FlowProps) => JSX.Element
