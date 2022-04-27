import { formatInputAmount } from 'src/utils/formatters/formatInputAmount'

describe('formatInputAmount', () => {
  it('Handles integers starting with 0', () => {
    expect(formatInputAmount('09887777')).toBe('9887777')
  })

  it('Handles integers starting with .', () => {
    expect(formatInputAmount('.9887777')).toBe('0.9887777')
  })

  it('Handles integers ending with .', () => {
    expect(formatInputAmount('9887777.')).toBe('9887777')
  })

  it('Handles allowed non-numeric characters', () => {
    expect(formatInputAmount('.')).toBe('0')
  })
})
