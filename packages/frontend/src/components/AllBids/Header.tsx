import { useNavigate } from 'react-router-dom'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { Button } from '../Buttons/Button'
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

const StyledHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  height: 160px;
  background: linear-gradient(to left, #7ec188 0%, #65c4e8 45.31%, #7779b5 100%);
  position: relative;
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
`
