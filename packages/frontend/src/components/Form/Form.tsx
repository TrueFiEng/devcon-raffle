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

export const FormHeading = styled.h2`
  color: ${Colors.White};
`

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-left: -170px;
  padding: 82px 115px;
  position: relative;
  z-index: 100;
  width: 724px;
  height: 450px;
  background: #6100ff;
`
