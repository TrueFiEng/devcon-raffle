import copyToClipboard from 'copy-to-clipboard'
import { ReactNode, useState } from 'react'
import { CopyIcon } from 'src/components/Icons'
import { Tooltip, TooltipButton } from 'src/components/Tooltip'

interface CopyButtonProps {
  value: string
  text?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  size?: number
}

export const CopyButton = ({ value, text, side, size }: CopyButtonProps) => {
  const [tooltipText, setTooltipText] = useState(text)
  return (
    <Tooltip side={side} tooltip={tooltipText} onOpenChange={(value) => !value && setTooltipText(text)}>
      <TooltipButton
        onClick={() => {
          copyToClipboard(value)
          setTooltipText('Copied!')
        }}
      >
        <CopyIcon size={size} />
      </TooltipButton>
    </Tooltip>
  )
}
