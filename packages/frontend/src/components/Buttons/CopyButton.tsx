import copyToClipboard from 'copy-to-clipboard'
import { ReactNode, useState } from 'react'
import { CopyIcon } from 'src/components/Icons/CopyIcon'
import { Tooltip, TooltipButton } from 'src/components/Tooltip'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

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
        onClick={(e) => {
          copyToClipboard(value)
          setTooltipText(<CopiedText>Copied!</CopiedText>)
          e?.preventDefault()
        }}
        onMouseDown={(e) => e?.preventDefault()}
      >
        <CopyIcon size={size} />
      </TooltipButton>
    </Tooltip>
  )
}

const CopiedText = styled.span`
  color: ${Colors.White};
`
