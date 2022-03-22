import { IconBase, IconProps } from 'src/components/Icons/IconBase'

export const CheckIcon = ({ color, size, className }: IconProps) => {
  return (
    <IconBase color={color} size={size} className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5057 10.4461C23.8116 10.7254 23.8332 11.1998 23.5539 11.5057L14.4234 21.5057C14.2842 21.6582 14.0882 21.7466 13.8816 21.7499C13.6751 21.7532 13.4764 21.6712 13.3323 21.5233L8.46271 16.5233C8.17371 16.2265 8.17999 15.7517 8.47672 15.4627C8.77346 15.1737 9.2483 15.18 9.53729 15.4767L13.852 19.907L22.4461 10.4943C22.7254 10.1884 23.1998 10.1668 23.5057 10.4461Z"
        fill="currentColor"
      />
    </IconBase>
  )
}
