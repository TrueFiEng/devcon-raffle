import { AccountButton } from 'src/components/Buttons/AccountButton'
import { Logo } from 'src/components/Icons/Logo'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const TopBar = () => {
  return (
    <TopBarContainer>
      <HomeLink href="/">
        <Logo />
      </HomeLink>
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
const HomeLink = styled.a`
  line-height: 1;
`
