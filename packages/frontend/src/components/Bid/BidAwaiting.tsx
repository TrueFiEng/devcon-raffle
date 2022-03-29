import { FormWrapper } from 'src/components/Form/Form'
import styled from 'styled-components'

export const BidAwaiting = () => {
  return (
    <BidStartWrapper>
      <h2>Bidding will start on 02 April at 11 AM</h2>
    </BidStartWrapper>
  )
}

const BidStartWrapper = styled(FormWrapper)`
  padding: 0 115px;
  justify-content: center;
`
