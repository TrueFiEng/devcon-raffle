import { Header } from 'src/components/Header'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Info = () => {
  return (
    <Wrapper>
      <Header />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${Colors.White};
`
