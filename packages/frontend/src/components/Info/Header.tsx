import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { HeaderBar } from '../common/Header'
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

const StyledHeader = styled(HeaderBar)`
  height: 225px;
  padding: 16px 125px 24px 68px;
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
