import { BigNumber } from '@ethersproject/bignumber'
import { formatEndDate } from 'src/utils/formatters/formatEndDate'

describe('formatEndDate', () => {
  it('Formats the date', () => {
    const timestamp = BigNumber.from(Date.parse('2022-03-08T16:03:27.000Z') / 1000)
    expect(formatEndDate(timestamp)).toBe('08.03')
  })
})
