import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import React from 'react'
import { formatEndDate } from 'src/utils/formatters/formatEndDate'
import { formatTimeLeft } from 'src/utils/formatters/formatTimeLeft'
import styled from 'styled-components'

export const TimeLeft = () => {
  const [endTimestamp] = useState(BigNumber.from(Math.floor(Date.now() / 1000) + 1234))
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
