import { ReactNode } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface TooltipLinkProps {
  color?: string
  children?: ReactNode
  href: string
  label?: string
}

export const TooltipLink = ({ color = Colors.Grey, href, children, label }: TooltipLinkProps) => {
  return (
    <TooltipLinkComponent color={color} href={href} target="_blank" rel="noopener noreferrer" label={label}>
      {children}
    </TooltipLinkComponent>
  )
}

const TooltipLinkComponent = styled.a<Pick<TooltipLinkProps, 'color' | 'label'>>`
  display: flex;
  align-items: center;
  width: max-content;
  padding: ${({ label }) => (label ? '4px 12px 4px 4px' : '0')};
  background-color: transparent;
  color: ${({ color }) => color};
  outline: none;
  user-select: none;
  text-decoration: none;
  transition: all 0.25s ease;

  &:hover,
  &:focus-visible {
    color: ${Colors.BlueDark};
    background-color: ${Colors.GreenLight};
  }
`
