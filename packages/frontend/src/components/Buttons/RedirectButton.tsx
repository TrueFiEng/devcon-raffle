import { ReactNode } from 'react'
import { RedirectIcon } from 'src/components/Icons/RedirectIcon'
import { Tooltip, TooltipLink } from 'src/components/Tooltip'

interface RedirectTooltipProps {
  link: string
  tooltip: string | ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  size?: number
}

export const RedirectButton = ({ link, tooltip, side, size = 24 }: RedirectTooltipProps) => {
  return (
    <Tooltip side={side} tooltip={tooltip}>
      <TooltipLink href={link}>
        <RedirectIcon size={size} />
      </TooltipLink>
    </Tooltip>
  )
}
