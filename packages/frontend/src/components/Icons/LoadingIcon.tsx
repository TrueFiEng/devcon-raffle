import { IconBase, IconProps } from 'src/components/Icons/IconBase'

export const LoadingIcon = ({ color, size, className }: IconProps) => {
  return (
    <IconBase color={color} size={size} className={className}>
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
    </IconBase>
  )
}
