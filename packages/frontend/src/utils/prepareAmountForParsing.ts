export function prepareAmountForParsing(bumpAmount: string): string {
  if (bumpAmount == '') {
    return '0'
  }

  if (bumpAmount.length > 0 && bumpAmount[0] == '.') {
    return '0' + bumpAmount
  }

  return bumpAmount
}
