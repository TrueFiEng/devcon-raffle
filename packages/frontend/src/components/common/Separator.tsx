import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface SeparatorElementProps {
  orientation?: 'horizontal' | 'vertical'
  color?: string
}

export const Separator = ({ orientation = 'horizontal', color }: SeparatorElementProps) => {
  return <SeparatorElement orientation={orientation} color={color} decorative />
}

const SeparatorElement = styled(SeparatorPrimitive.Root)<SeparatorElementProps>`
  background-color: ${({ color }) => (color ? color : Colors.GreenLight)};

  &[data-orientation='horizontal'] {
    height: 1px;
    width: 100%;
  }

  &[data-orientation='vertical'] {
    height: 100%;
    width: 1px;
  }
`
