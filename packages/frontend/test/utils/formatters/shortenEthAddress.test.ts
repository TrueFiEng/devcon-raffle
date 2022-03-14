import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'

describe('shortenEthAddress', () => {
  it('Shortens an address', () => {
    expect(shortenEthAddress('0x6Aa2FD441be648A222da6913aa04810212b108A7')).toBe('0x6Aa2......08A7')
  })
})
