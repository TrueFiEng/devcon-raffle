export const Colors = {
  White: '#FFFFFF',
  Black: '#000000',
  Catskill: '#FBFCFD',
  Athens: '#F8F9FB',
  Porcelain: '#E7EAF3',
  Mystic: '#D0D6E6',
  Casper: '#9FAAC4',
  Waterloo: '#7A859E',
  Shuttle: '#60697C',
  BigStone: '#0B0E14',
  Shark: '#030303',
  Cobalt: '#1A5AFF',
  Green: '#00A368',
  Transparent: 'transparent',
}

export const hexOpacity = (color: string, opacity: number) => {
  const trimmedColor = color.replace('#', '')
  const calculatedOpacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
  return '#' + trimmedColor + calculatedOpacity.toString(16).padStart(2, '0').toUpperCase()
}
