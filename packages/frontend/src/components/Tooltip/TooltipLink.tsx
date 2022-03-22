import React, { ReactNode } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface TooltipLinkProps {
  color?: string
  children?: ReactNode
  href: string
}

export const TooltipLink = ({ color = Colors.Grey, href, children }: TooltipLinkProps) => {
  return (
    <TooltipLinkComponent color={color} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </TooltipLinkComponent>
  )
}

const TooltipLinkComponent = styled.a<Pick<TooltipLinkProps, 'color'>>`
  color: ${({ color }) => color};
  transition: all 0.25s ease;
  width: 32px;
  height: 32px;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  user-select: none;

  &:hover,
  &:focus-visible {
    color: ${Colors.BlueDark};
    background-color: ${Colors.GreenLight};
  }
`
