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
  width: max-content;
  padding: 4px 12px 4px 4px;
  transition: all 0.25s ease;

  &:hover,
  &:focus-visible {
    color: ${Colors.BlueDark};
    background-color: ${Colors.GreenLight};
  }
`
