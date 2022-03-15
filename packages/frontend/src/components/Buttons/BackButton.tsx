import { ArrowLeftIcon } from 'src/components/Icons/ArrowLeftIcon'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface BackButtonProps {
  view: number
  setView: (view: number) => void
}

export function BackButton({ view, setView }: BackButtonProps) {
  return (
    <BackBtn onClick={() => setView(view - 1)}>
      <ArrowLeftIcon />
      Back
    </BackBtn>
  )
}

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  width: 84px;
  height: 32px;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  background-color: ${Colors.Transparent};
  color: ${Colors.GreenLight};
  border: 1px solid ${Colors.GreenLight};

  &:hover,
  &:focus-visible,
  &:active {
    background-color: ${Colors.GreenLight};
    color: ${Colors.Black};
  }
`
