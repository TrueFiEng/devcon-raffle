import styled from 'styled-components'

export const LoadingBids = () => (
  <Wrapper>
    <h3>{`Loading bids...`}</h3>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`
