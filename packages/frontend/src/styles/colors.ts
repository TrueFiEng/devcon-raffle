export const Colors = {
  White: '#FFFFFF',
  Black: '#000000',
  Blue: '#1144AA',
  BlueDark: '#103D96',
  Green: '#AED1CC',
  GreenLight: '#DDFAF7',
  Grey: '#60697C',
  GreyLight: '#F9F9F9',
  Transparent: 'transparent',
}

export const hexOpacity = (color: string, opacity: number) => {
  const trimmedColor = color.replace('#', '')
  const calculatedOpacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
  return '#' + trimmedColor + calculatedOpacity.toString(16).padStart(2, '0').toUpperCase()
}
