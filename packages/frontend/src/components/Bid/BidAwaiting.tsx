import { FormWideWrapper } from 'src/components/Form/Form'
import styled from 'styled-components'

export const BidAwaiting = () => {
  return (
    <BidAwaitingWrapper>
      <h2>Bidding has not started yet ⏳</h2>
    </BidAwaitingWrapper>
  )
}

const BidAwaitingWrapper = styled(FormWideWrapper)`
  padding: 0 54px;
`
