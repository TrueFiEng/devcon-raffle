import { AccountButton } from 'src/components/Buttons'
import { Logo } from 'src/components/Icons'
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
  background-color: ${Colors.White};
  position: sticky;
  top: 0;
  z-index: 99;
  padding: 8px 34px;
  gap: 8px;
  
  @media (max-width: 640px) {
    padding: 8px 24px;
  }
`
const HomeLink = styled.a`
  line-height: 1;
`
