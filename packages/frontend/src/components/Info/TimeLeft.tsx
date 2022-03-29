import { BigNumber } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'
import { useAuctionState } from 'src/hooks/useAuctionState'
import { formatEndDate } from 'src/utils/formatters/formatEndDate'
import { formatTimeLeft } from 'src/utils/formatters/formatTimeLeft'
import styled from 'styled-components'

interface Props {
  endTimestamp: BigNumber
}

export const TimeLeft = ({ endTimestamp }: Props) => {
  const state = useAuctionState()
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(endTimestamp))
  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(formatTimeLeft(endTimestamp)), 1_000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TimeBox>
      <TimeRow>
        <span>{state === 'Awaiting' ? 'Till start' : ' Time left'}</span>
        <RemainingTime>{timeLeft}</RemainingTime>
      </TimeRow>
      <TimeRow>
        Ends on <RemainingTime>{formatEndDate(endTimestamp)}</RemainingTime>
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
