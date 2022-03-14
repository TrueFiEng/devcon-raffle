import { IconContainer, IconWrapper, IconProps } from 'src/components/Icons/IconBase'

export const ArrowDownIcon = ({ color, size = 22, className }: IconProps) => {
  return (
    <IconContainer color={color} size={size} className={className}>
      <IconWrapper width={size} height={size} viewBox={`0 0 ${size} ${size / 2}`} fill="none" color="currentColor">
        <path d="M0.886719 0L11.4434 10L22.0001 0H0.886719Z" fill="currentColor" />
      </IconWrapper>
    </IconContainer>
  )
}
