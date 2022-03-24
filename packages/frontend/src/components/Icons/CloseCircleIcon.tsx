import { IconBase, IconProps } from 'src/components/Icons/IconBase'
import React from 'react'

export const CloseCircleIcon = ({ color, size, className }: IconProps) => {
  return (
    <IconBase color={color} size={size} className={className}>
      <circle cx="7.5" cy="7.5" r="7" stroke="currentColor" />
      <path d="M4.03906 4.03833L10.6737 10.6729" stroke="currentColor" />
      <path d="M4.35547 10.6729L10.9901 4.03824" stroke="currentColor" />
    </IconBase>
  )
}
