import { TruefiLogoIcon } from 'src/components/Icons'
import { Colors, hexOpacity } from 'src/styles/colors'
import styled from 'styled-components'


export const Footer = () => {
  return (
    <FooterContainer>
      <FooterRow>
        <p>Built with 💙 by</p>
        <TruefiLogoIcon />
      </FooterRow>
      <FooterCopyright>© 2022. All rights reserved.</FooterCopyright>
    </FooterContainer>
  )
}

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 8px;
  padding: 40px 0;
  background-color: ${Colors.White};
  border-top: 1px solid ${hexOpacity(Colors.Black, 0.1)};
`

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
  padding: 15px 0;
`

const FooterCopyright = styled.p`
  color: ${Colors.GreyDark};
`
