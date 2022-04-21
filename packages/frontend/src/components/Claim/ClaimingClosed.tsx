import { FormWrapper } from 'src/components/Form/Form'
import styled from 'styled-components'

export const ClaimingClosed = () => {
  return (
    <BidStartWrapper>
      <h2>Claiming is closed ⌛️</h2>
    </BidStartWrapper>
  )
}

const BidStartWrapper = styled(FormWrapper)`
  padding: 0 0 0 170px;
  justify-content: center;
`
