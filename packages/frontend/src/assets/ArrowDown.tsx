import { IconBase, IconProps } from 'src/assets/IconBase'

export const ArrowDownIcon = ({ color, size, className }: IconProps) => {
  return (
    <IconBase color={color} size={size} className={className}>
      <path d="M0.886719 0L11.4434 10L22.0001 0H0.886719Z" fill="currentColor" />
    </IconBase>
  )
}
