import { useNavigate } from 'react-router-dom'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { Button } from '../Buttons/Button'
import { HeaderBar } from '../common/Header'
import { KeyIcon } from '../Icons/KeyIcon'

export const Header = () => {
  const navigate = useNavigate()

  return (
    <StyledHeader>
      <Wrapper>
        <Title>
          <h2>Number of participants:</h2>
          <Number>234</Number>
        </Title>
      </Wrapper>
      <BackButton onClick={() => navigate('/')}>Back</BackButton>
      <Key>
        <KeyIcon />
      </Key>
    </StyledHeader>
  )
}

const StyledHeader = styled(HeaderBar)`
  height: 160px;
  overflow: hidden;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${Colors.White};
`

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Key = styled.div`
  position: absolute;
  bottom: -5px;
  right: 68px;
  height: 225px;
`

const Number = styled.h2`
  color: ${Colors.BlueDark};
`

const BackButton = styled(Button)`
  position: absolute;
  top: 36px;
  left: 68px;
  width: 84px;
  color: ${Colors.BlueLight};
  background-color: ${Colors.Transparent};
  border: 1px solid ${Colors.BlueLight};
`
