import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { KeyIcon } from '../Icons/KeyIcon'

import { TimeLeft } from './TimeLeft'

export const Header = () => {
  const [endTimestamp] = useState(BigNumber.from(Math.floor(Date.now() / 1000) + 1234))

  return (
    <StyledHeader>
      <Wrapper>
        <Title>
          <h1>Devcon 6</h1>
          <SubTitle>Ticket Sale</SubTitle>
        </Title>
        <TimeLeft endTimestamp={endTimestamp} />
      </Wrapper>
      <Key>
        <KeyIcon />
      </Key>
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  height: 225px;
  background: linear-gradient(to left, #7ec188 0%, #65c4e8 45.31%, #7779b5 100%);
  padding: 16px 125px 24px 68px;
  position: relative;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  color: ${Colors.White};
`

const Title = styled.div`
  display: flex;
  flex-direction: column;
`

const SubTitle = styled.h3`
  color: ${Colors.White};
`
const Key = styled.div`
  position: absolute;
  top: 0;
  right: 125px;
  height: 225px;
`
