import { InfoAccordion } from 'src/components/Info/Accordion'
import { Header } from 'src/components/Info/Header'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Info = () => {
  return (
    <Wrapper>
      <Header />
      <InfoAccordion />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${Colors.White};
`
