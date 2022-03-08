import { BigNumber } from '@ethersproject/bignumber'
import { formatTimeLeft } from 'src/utils/formatTimeLeft'

describe('formatTimeLeft', () => {
  const minutesToMillis = (n: number) => n * 60 * 1000
  const minutesToSeconds = (n: number) => n * 60

  it('Formats minutes', () => {
    const date = BigNumber.from(minutesToSeconds(60))
    const now = minutesToMillis(30)
    expect(formatTimeLeft(date, now)).toBe('0d 00h 30m')
  })

  it('Formats hours', () => {
    const date = BigNumber.from(minutesToSeconds(60 * 2))
    const now = minutesToMillis(30)
    expect(formatTimeLeft(date, now)).toBe('0d 01h 30m')
  })

  it('Formats days', () => {
    const date = BigNumber.from(minutesToSeconds(60 * 26))
    const now = minutesToMillis(30)
    expect(formatTimeLeft(date, now)).toBe('1d 01h 30m')
  })

  it('Rounds down excess seconds', () => {
    const date = BigNumber.from(minutesToSeconds(60))
    const now = minutesToMillis(30) + 1000 * 40
    expect(formatTimeLeft(date, now)).toBe('0d 00h 30m')
  })

  it('Past date displays as zeroes', () => {
    const date = BigNumber.from(minutesToSeconds(60))
    const now = minutesToMillis(230)
    expect(formatTimeLeft(date, now)).toBe('0d 00h 00m')
  })
})
