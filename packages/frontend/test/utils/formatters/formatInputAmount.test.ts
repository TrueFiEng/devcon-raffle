import { formatInputAmount } from 'src/utils/formatters/formatInputAmount'

describe('formatInputAmount', () => {
  it('Handles integers start with 0', () => {
    expect(formatInputAmount('09887777')).toBe('9887777')
  })

  it('Handles integers start with .', () => {
    expect(formatInputAmount('.9887777')).toBe('0.9887777')
  })

  it('Handles integers end with .', () => {
    expect(formatInputAmount('9887777.')).toBe('9887777')
  })

  it('Handles allowed non-numeric characters', () => {
    expect(formatInputAmount('.')).toBe('0')
  })
})
