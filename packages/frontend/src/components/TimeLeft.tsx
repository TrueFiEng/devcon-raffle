import { BigNumber } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'
import React from 'react'
import { formatEndDate } from 'src/utils/formatters/formatEndDate'
import { formatTimeLeft } from 'src/utils/formatters/formatTimeLeft'
import styled from 'styled-components'

export const TimeLeft = () => {
  const [endTimestamp] = useState(BigNumber.from(Math.floor(Date.now() / 1000) + 1234))
  const [heartbeat, beat] = useState(true)
  useEffect(() => {
    setTimeout(() => beat(!heartbeat), 60_000)
  }, [heartbeat])
  return (
    <div>
      <p>
        Time left <RemainingTime>{formatTimeLeft(endTimestamp)}</RemainingTime>
      </p>
      <p>Ends on {formatEndDate(endTimestamp)}</p>
    </div>
  )
}

const RemainingTime = styled.span`
  font-weight: 500;
`
