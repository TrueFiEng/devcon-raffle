import { CloseIcon } from 'src/components/Icons'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface CloseButtonProps {
  onClick: () => void
}
export const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <CloseButtonWrapper onClick={onClick}>
      <CloseIcon size={15} />
    </CloseButtonWrapper>
  )
}

const CloseButtonWrapper = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  color: ${Colors.Black};
  background-color: ${Colors.Transparent};
  outline: none;
`
