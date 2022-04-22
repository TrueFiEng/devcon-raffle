import { KeyIcon } from 'src/components/Icons'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { HeaderBar } from '../common/Header'

import { TimeLeft } from './TimeLeft'

export const Header = () => {
  return (
    <StyledHeader>
      <HeaderWrapper>
        <Wrapper>
          <TitleWrapper>
            <Title>Devcon 6</Title>
            <SubTitle>Ticket Sale</SubTitle>
          </TitleWrapper>
          <TimeLeft />
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

  @media screen and (min-width: 1600px) {
    justify-content: flex-start;
    row-gap: 40px;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1600px) {
    flex-direction: row;
    align-items: flex-end;
    column-gap: 20px;
    padding-top: 16px;
  }
`

const Title = styled.h1`
  @media screen and (min-width: 1600px) {
    line-height: 1;
  }
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
