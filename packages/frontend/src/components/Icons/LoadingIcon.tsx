import { IconContainer, IconProps } from 'src/components/Icons/IconBase'

export const LoadingIcon = ({ color, size = 32, className }: IconProps) => {
  return (
    <IconContainer color={color} size={size} className={className}>
      <svg width={size} height={size} viewBox={`0 0 32 32`} fill="none" color="currentColor">
        <circle cx="16" cy="16" r="6.5" strokeWidth="1.5" stroke="currentColor" opacity="0.25" />
        <circle
          cx="16"
          cy="16"
          r="6.5"
          strokeWidth="1.5"
          stroke="currentColor"
          strokeDasharray="45"
          strokeDashoffset="60"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 16 16"
            to="360 16 16"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </IconContainer>
  )
}
