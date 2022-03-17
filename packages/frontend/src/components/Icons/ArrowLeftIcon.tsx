import { IconBase, IconProps } from 'src/components/Icons/IconBase'

export const ArrowLeftIcon = ({ color, size, className }: IconProps) => {
  return (
    <IconBase color={color} size={size} className={className}>
      <path
        d="M20.25 15.75C20.6642 15.75 21 16.0858 21 16.5C21 16.9142 20.6642 17.25 20.25 17.25H14V18.6381C14 18.941 13.5872 19.1094 13.3086 18.9202L10.1597 16.7822C9.94677 16.6376 9.94675 16.3627 10.1597 16.2181L13.3086 14.0798C13.5872 13.8906 14 14.059 14 14.3619V15.75H20.25Z"
        fill="currentColor"
      />
    </IconBase>
  )
}
