import { Logo } from 'src/images/Logo'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { AccountButton } from './AccountButton'

export const TopBar = () => {
  return (
    <TopBarContainer>
      <Logo />
      <AccountButton />
    </TopBarContainer>
  )
}

const TopBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 56px;
  width: 100%;
  padding: 0 68px;
  background: ${Colors.White};
`
