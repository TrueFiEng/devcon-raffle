import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface TooltipProps {
  side?: 'top' | 'right' | 'bottom' | 'left'
  tooltip: ReactNode
  children: ReactNode
  onOpenChange?: (open: boolean) => void
}

export const Tooltip = ({ side = 'bottom', tooltip, children, onOpenChange }: TooltipProps) => {
  return (
    <TooltipPrimitive.Root delayDuration={250} onOpenChange={onOpenChange}>
      <TooltipPrimitive.Trigger asChild role="tooltip" onMouseDown={(e) => e.preventDefault()}>
        <TooltipTriggerContainer>{children}</TooltipTriggerContainer>
      </TooltipPrimitive.Trigger>
      <TooltipContent side={side} sideOffset={side === 'top' || side === 'bottom' ? 4 : 8}>
        {tooltip}
        <Arrow width={21} height={10} />
      </TooltipContent>
    </TooltipPrimitive.Root>
  )
}

const TooltipTriggerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
  cursor: help;
`

const TooltipContent = styled(TooltipPrimitive.Content)`
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 8px 42px;
  background-color: ${Colors.Black};
  font-size: 12px;
  line-height: 14px;
  color: ${Colors.White};
`
const Arrow = styled(TooltipPrimitive.Arrow)`
  fill: ${Colors.Black};
`
