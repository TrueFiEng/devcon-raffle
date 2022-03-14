import { Logo } from 'src/images/Logo'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { AccountButton } from './AccountButton'

export const TopBar = () => {
  return (
    <TopBarContainer>
      <Wrapper>
        <Logo />
        <AccountButton />
      </Wrapper>
    </TopBarContainer>
  )
}

const TopBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 56px;
  width: 100%;
  background: ${Colors.White};
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 68px;
  width: 100%;
`
