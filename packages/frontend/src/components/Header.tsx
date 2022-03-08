import styled from 'styled-components'

export const Header = () => {
  return (
    <StyledHeader>
      <h1>Devcon 6 Ticket Sale</h1>
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 10px;
  width: 100%;
  height: 225px;
  background: #5600e3;
`
