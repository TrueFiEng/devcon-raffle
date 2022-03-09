import { BigNumber } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'
import React from 'react'
import { formatEndDate } from 'src/utils/formatters/formatEndDate'
import { formatTimeLeft } from 'src/utils/formatters/formatTimeLeft'
import styled from 'styled-components'

export const TimeLeft = () => {
  const [endTimestamp] = useState(BigNumber.from(Math.floor(Date.now() / 1000) + 1234))

  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(endTimestamp))
  useEffect(() => {
    setTimeout(() => setTimeLeft(formatTimeLeft(endTimestamp)), 60_000)
  }, [timeLeft, endTimestamp])

  return (
    <div>
      <p>
        Time left <RemainingTime>{timeLeft}</RemainingTime>
      </p>
      <p>Ends on {formatEndDate(endTimestamp)}</p>
    </div>
  )
}

const RemainingTime = styled.span`
  font-weight: 500;
`
