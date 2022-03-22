import styled from 'styled-components'

export const NothingFound = () => (
  <Wrapper>
    <h3>Sorry, we didn't find this address 😔</h3>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-height: 100%;
`
