import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { Colors } from 'src/styles/colors'
import styled, { css } from 'styled-components'

interface SeparatorElementProps {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  spaceStart?: number
  spaceEnd?: number
  color?: string
}

export const Separator = ({
  orientation = 'horizontal',
  decorative = true,
  spaceStart,
  spaceEnd,
  color,
}: SeparatorElementProps) => {
  return (
    <SeparatorElement
      orientation={orientation}
      decorative={decorative}
      spaceStart={spaceStart}
      spaceEnd={spaceEnd}
      color={color}
    />
  )
}

const SeparatorElement = styled(SeparatorPrimitive.Root)<SeparatorElementProps>`
  background-color: ${({ color }) => (color ? color : Colors.GreenLight)};

  &[data-orientation='horizontal'] {
    height: 1px;
    width: 100%;

    ${({ spaceStart }) =>
      spaceStart &&
      css`
        margin-top: ${spaceStart}px;
      `}

    ${({ spaceEnd }) =>
      spaceEnd &&
      css`
        margin-bottom: ${spaceEnd}px;
      `}
  }

  &[data-orientation='vertical'] {
    height: 100%;
    width: 1px;

    ${({ spaceStart }) =>
      spaceStart &&
      css`
        margin-left: ${spaceStart}px;
      `}

    ${({ spaceEnd }) =>
      spaceEnd &&
      css`
        margin-right: ${spaceEnd}px;
      `}
  }
`
