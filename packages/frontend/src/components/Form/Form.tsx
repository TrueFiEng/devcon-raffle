import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  width: 100%;
  max-width: 460px;
  overflow: hidden;
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
