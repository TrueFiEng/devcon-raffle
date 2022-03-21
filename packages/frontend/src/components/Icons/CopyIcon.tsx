import { IconBase, IconProps } from 'src/components/Icons/IconBase'

export const CopyIcon = ({ color, size, className }: IconProps) => {
  return (
    <IconBase color={color} size={size} className={className}>
      <path
        d="M11.5 9.75C10.5335 9.75 9.75 10.5335 9.75 11.5V16.5C9.75 17.4665 10.5335 18.25 11.5 18.25H12.25C12.6642 18.25 13 17.9142 13 17.5C13 17.0858 12.6642 16.75 12.25 16.75H11.5C11.3619 16.75 11.25 16.6381 11.25 16.5V11.5C11.25 11.3619 11.3619 11.25 11.5 11.25H16.5C16.6381 11.25 16.75 11.3619 16.75 11.5V12.25C16.75 12.6642 17.0858 13 17.5 13C17.9142 13 18.25 12.6642 18.25 12.25V11.5C18.25 10.5335 17.4665 9.75 16.5 9.75H11.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5 13.75C14.5335 13.75 13.75 14.5335 13.75 15.5V20.5C13.75 21.4665 14.5335 22.25 15.5 22.25H20.5C21.4665 22.25 22.25 21.4665 22.25 20.5V15.5C22.25 14.5335 21.4665 13.75 20.5 13.75H15.5ZM15.25 15.5C15.25 15.3619 15.3619 15.25 15.5 15.25H20.5C20.6381 15.25 20.75 15.3619 20.75 15.5V20.5C20.75 20.6381 20.6381 20.75 20.5 20.75H15.5C15.3619 20.75 15.25 20.6381 15.25 20.5V15.5Z"
        fill="currentColor"
      />
    </IconBase>
  )
}