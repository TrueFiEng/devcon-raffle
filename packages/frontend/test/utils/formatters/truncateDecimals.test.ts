import { truncateDecimals } from 'src/utils/formatters/truncateDecimals'

describe('truncateDecimals', () => {
  it('Truncates decimals', () => {
    expect(truncateDecimals('0.1111111111111')).toBe('0.111111')
  })

  it('Lets an integer through', () => {
    expect(truncateDecimals('12')).toBe('12')
  })

  it('Handles shorter decimals than specified', () => {
    expect(truncateDecimals('0.1')).toBe('0.1')
  })

  it('Handles decimals with multiple digits before decimal point', () => {
    expect(truncateDecimals('123.1')).toBe('123.1')
  })
})
