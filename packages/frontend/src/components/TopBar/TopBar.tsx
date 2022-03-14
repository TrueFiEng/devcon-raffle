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
  padding: 8px 68px;
  background-color: ${Colors.White};
  position: sticky;
  top: 0;
  z-index: 2000;
`
