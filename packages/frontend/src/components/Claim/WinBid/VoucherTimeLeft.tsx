import { useEffect, useState } from 'react'
import { useClaimingEndTime } from 'src/hooks'
import { Colors } from 'src/styles/colors'
import { setIntervalImmediately } from 'src/utils'
import { formatTimeLeft } from 'src/utils/formatters'
import styled from 'styled-components'

export const VoucherTimeLeft = () => {
  const { claimingEndTime } = useClaimingEndTime()
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(claimingEndTime))

  useEffect(() => {
    const interval = setIntervalImmediately(() => setTimeLeft(formatTimeLeft(claimingEndTime)), 1_000)
    return () => clearInterval(interval)
  }, [claimingEndTime])

  return (
    <TimeRow>
      <RemainingTime>{timeLeft}</RemainingTime>
      <span>left to redeem your voucher code</span>
    </TimeRow>
  )
}

const TimeRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 16px;
  row-gap: 8px;
  line-height: 1;
  color: ${Colors.White};
`
const RemainingTime = styled.span`
  font-size: 24px;
  font-weight: 700;
  font-family: 'Space Mono', 'Roboto Mono', monospace;
`
