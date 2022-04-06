import { useEffect, useState } from 'react'
import { useAuctionState } from 'src/hooks/useAuctionState'
import { useAuctionTime } from 'src/hooks/useAuctionTime'
import { formatEndDate } from 'src/utils/formatters/formatEndDate'
import { formatTimeLeft } from 'src/utils/formatters/formatTimeLeft'
import { setTimeoutImmediately } from 'src/utils/setTimeoutImmediately'
import styled from 'styled-components'

export const TimeLeft = () => {
  const { timestamp } = useAuctionTime()
  const state = useAuctionState()

  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(timestamp))

  useEffect(() => {
    const interval = setTimeoutImmediately(() => setTimeLeft(formatTimeLeft(timestamp)), 1_000)
    return () => clearTimeout(interval)
  }, [timestamp, timeLeft])

  return (
    <TimeBox>
      <TimeRow>
        <span>{state === 'AwaitingBidding' ? 'Till start' : ' Time left'}</span>
        <RemainingTime>{timeLeft}</RemainingTime>
      </TimeRow>
      <TimeRow>
        Ends on <RemainingTime>{formatEndDate(timestamp)}</RemainingTime>
      </TimeRow>
    </TimeBox>
  )
}

const TimeBox = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  font-family: 'Space Mono', 'Roboto Mono', monospace;
`
const TimeRow = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`

const RemainingTime = styled.span`
  font-weight: 700;
`
