import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  width: 100%;
  max-width: 460px;
  overflow: hidden;
`

export const FormNarrow = styled(Form)`
  max-width: 289px;
`

export const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: ${Colors.White};
`

export const FormHeading = styled.h2`
  color: ${Colors.White};
`

export const FormSubHeading = styled.h3`
  color: ${Colors.White};
`

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 82px 115px 82px 170px;
  width: 100%;
`
