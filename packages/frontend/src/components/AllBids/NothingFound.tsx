import styled from 'styled-components'

interface NothingFoundProps {
  search?: string
}

export const NothingFound = ({ search }: NothingFoundProps) => (
  <Wrapper>
    <h3>{search ? `Sorry, we didn't find this address 😔` : 'There are no bids right now 👀'}</h3>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`
