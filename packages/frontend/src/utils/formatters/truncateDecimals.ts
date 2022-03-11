export const truncateDecimals = (num: string) =>
  new RegExp(/\d+\.\d{0,6}/).exec(num)?.[0] ?? num
