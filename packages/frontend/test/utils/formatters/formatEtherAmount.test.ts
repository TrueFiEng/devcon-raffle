import { formatEtherAmount } from '../../../src/utils/formatters/formatEtherAmount'
import { parseEther } from '@ethersproject/units'


describe('formatEtherAmount', () => {
  it('Truncates decimals', () => {
  })

  it('Truncates and rounds', () => {
    expect(formatEtherAmount(parseEther('1.123456999999'))).toBe('1.123457')
  })

  it('Handles large numbers', () => {
    expect(formatEtherAmount(parseEther('1923.123456789'))).toBe('1923.123457')
  })

  it('Handles numbers with fewer than 6 decimal places', () => {
    expect(formatEtherAmount(parseEther('1923.12'))).toBe('1923.12')
  })
})
