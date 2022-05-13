import { ReactNode, MouseEvent } from 'react'
import { Button } from 'src/components/Buttons'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface TooltipButtonProps {
  color?: string
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => void
  onMouseDown?: (event?: MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
}

export const TooltipButton = ({ color = Colors.Grey, children, ...props }: TooltipButtonProps) => {
  return (
    <TooltipButtonComponent color={color} {...props}>
      {children}
    </TooltipButtonComponent>
  )
}

const TooltipButtonComponent = styled(Button)<Pick<TooltipButtonProps, 'color'>>`
  color: ${({ color }) => color};
  background-color: ${Colors.White};
  transition: all 0.25s ease;
  width: 32px;
  height: 32px;
  padding: 0;

  &:hover,
  &:focus-visible {
    color: ${Colors.BlueDark};
    background-color: ${Colors.GreenLight};
  }
`
