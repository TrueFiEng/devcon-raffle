import { truncateDecimals } from 'src/utils/formatters/truncateDecimals'

describe('truncateDecimals', () => {
  it('Truncates decimals', () => {
    expect(truncateDecimals('0.1111111111111')).toBe('0.111111')
  })

  it('Truncates decimals to custom length', () => {
    expect(truncateDecimals('0.1111111111111', 2)).toBe('0.11')
  })

  it('Lets an integer through', () => {
    expect(truncateDecimals('12')).toBe('12')
  })

  it('Handles shorter decimals than specified', () => {
    expect(truncateDecimals('0.1', 12)).toBe('0.1')
  })
})
