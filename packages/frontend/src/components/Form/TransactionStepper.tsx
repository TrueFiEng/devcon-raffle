import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const TransactionStepper = () => {
  return <StepperContainer></StepperContainer>
}

const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 313px;
  padding: 82px 0;
  background-color: ${Colors.BlueDark};
`
