import { ReactNode } from 'react'
import styled from 'styled-components'

export interface IconProps {
  color?: string
  size?: number
  className?: string
}

interface IconBaseProps extends IconProps {
  children: ReactNode
}

export function IconBase({ children, color, size = 32, className }: IconBaseProps) {
  return (
    <IconContainer color={color} size={size} className={className}>
      <IconWrapper width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" color="currentColor">
        {children}
      </IconWrapper>
    </IconContainer>
  )
}

export const IconContainer = styled.div<IconBaseProps>`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size + 'px'};
  min-width: ${({ size }) => size + 'px'};
  max-width: ${({ size }) => size + 'px'};
  height: ${({ size }) => size + 'px'};
  min-height: ${({ size }) => size + 'px'};
  max-height: ${({ size }) => size + 'px'};
  color: ${({ color }) => color};
  overflow: hidden;
`

export const IconWrapper = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`
