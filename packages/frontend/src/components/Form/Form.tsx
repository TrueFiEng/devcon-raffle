import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Form = styled.form`
  display: grid;
  grid-row-gap: 16px;
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