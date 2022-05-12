import { ReactNode } from 'react'
import { RedirectIcon } from 'src/components/Icons'
import { Tooltip, TooltipLink } from 'src/components/Tooltip'
import styled from 'styled-components'

interface RedirectTooltipProps {
  link: string
  tooltip: string | ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  size?: number
  color?: string
  label?: string
}

export const RedirectButton = ({ link, tooltip, side, size, color, label }: RedirectTooltipProps) => {
  return (
    <Tooltip side={side} tooltip={tooltip}>
      <TooltipLink href={link} label={label}>
        <RedirectIcon size={size} color={color} />
        {label && <RedirectButtonLabel color={color}>{label}</RedirectButtonLabel>}
      </TooltipLink>
    </Tooltip>
  )
}

const RedirectButtonLabel = styled.span<Pick<RedirectTooltipProps, 'color' | 'size'>>`
  font-weight: 400;
  font-size: 14px;
  line-height: ${({ size }) => size};
  color: ${({ color }) => color};
`
