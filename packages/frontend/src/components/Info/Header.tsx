import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { HeaderBar } from '../common/Header'
import { KeyIcon } from '../Icons/KeyIcon'

import { TimeLeft } from './TimeLeft'

export const Header = () => {
  const [endTimestamp] = useState(BigNumber.from(Math.floor(Date.now() / 1000) + 1234))

  return (
    <StyledHeader>
      <HeaderWrapper>
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
      </HeaderWrapper>
    </StyledHeader>
  )
}

const StyledHeader = styled(HeaderBar)`
  height: 225px;
  padding: 16px 125px 24px 68px;
`

const HeaderWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  max-width: 1058px;
  margin: 0 auto;
  position: relative;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
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
  top: -16px;
  right: 0;
  height: 225px;
`
