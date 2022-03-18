import copyToClipboard from 'copy-to-clipboard'
import { CopyIcon } from 'src/components/Icons/CopyIcon'
import styled from 'styled-components'

interface CopyButtonProps {
  value: string
  size?: number
}

export const CopyButton = ({ value, size = 32 }: CopyButtonProps) => {
  return (
    <Button
      onClick={(e) => {
        copyToClipboard(value)
        e?.preventDefault()
      }}
      onMouseDown={(e) => e?.preventDefault()}
    >
      <CopyIcon size={size} />
    </Button>
  )
}

const Button = styled.button`
  border: none;
  padding: none;
`
