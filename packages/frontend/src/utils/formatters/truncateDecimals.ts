export const truncateDecimals = (num: string, decimals = 6) =>
  new RegExp(`\\d\\.\\d{0,${decimals}}`).exec(num)?.[0] ?? num
