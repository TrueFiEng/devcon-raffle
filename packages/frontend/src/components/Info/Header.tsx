import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { TimeLeft } from './TimeLeft'

export const Header = () => {
  const [endTimestamp] = useState(BigNumber.from(Math.floor(Date.now() / 1000) + 1234))

  return (
    <StyledHeader>
      <h1>Devcon 6 Ticket Sale</h1>
      <TimeLeft endTimestamp={endTimestamp} />
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  row-gap: 10px;
  width: 100%;
  height: 225px;
  color: ${Colors.White};
  background: linear-gradient(to left, #7ec188 0%, #65c4e8 45.31%, #7779b5 100%);
`
