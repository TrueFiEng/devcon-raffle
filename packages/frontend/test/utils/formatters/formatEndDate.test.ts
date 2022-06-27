import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment-timezone'
import { formatEndDate } from 'src/utils/formatters'

describe('formatEndDate', () => {
  it('Returns hyphen for undefined timestamp', () => {
    expect(formatEndDate(undefined)).toBe('-')
  })

  it('Formats the date', () => {
    const timestamp = BigNumber.from(Date.parse('2022-03-08T16:03:27.000Z')).div(1000)
    const testTimeZone = moment.tz.guess()
    const timeZone = moment.tz.zone(testTimeZone)?.abbr(timestamp.toNumber())

    expect(formatEndDate(timestamp)).toBe(`08.03, 17:03 ${timeZone}`)
  })
})
