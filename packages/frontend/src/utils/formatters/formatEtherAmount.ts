import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'

const decimalPlaces = 6
const factor = 10 ** decimalPlaces

export function formatEtherAmount(amount: BigNumber) {
  const strAmount = formatEther(amount)
  const formattedValue = Math.round(Number(strAmount) * factor) / factor
  return formattedValue.toString()
}
