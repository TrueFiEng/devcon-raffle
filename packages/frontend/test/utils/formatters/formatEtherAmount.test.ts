import { parseEther } from '@ethersproject/units'

import { formatEtherAmount } from '../../../src/utils/formatters/formatEtherAmount'

describe('formatEtherAmount', () => {
  it('Truncates and rounds', () => {
    expect(formatEtherAmount(parseEther('1.123456111111'))).toBe('1.123456')
    expect(formatEtherAmount(parseEther('1.123456999999'))).toBe('1.123457')
  })

  it('Handles large numbers', () => {
    expect(formatEtherAmount(parseEther('1923.123456789'))).toBe('1923.123457')
  })

  it('Handles numbers smaller than 1', () => {
    expect(formatEtherAmount(parseEther('0.0003819'))).toBe('0.000382')
  })

  it('Handles numbers with fewer than 6 decimal places', () => {
    expect(formatEtherAmount(parseEther('1923.12'))).toBe('1923.12')
  })
})
