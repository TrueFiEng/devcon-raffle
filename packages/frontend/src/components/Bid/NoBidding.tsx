import { FormWrapper, FormHeading, FormText } from 'src/components/Form/Form'
import styled from 'styled-components'

export const NoBidding = () => {
  return (
    <Wrapper>
      <FormHeading>Bidding time is over ⌛️</FormHeading>
      <FormText>Try your luck next year!</FormText>
    </Wrapper>
  )
}

const Wrapper = styled(FormWrapper)`
  padding: 0 0 0 115px;
  justify-content: center;
`
