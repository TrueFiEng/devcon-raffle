import { unpadHexString } from 'src/utils/formatters/unpadHexString'

describe('unpadHexString', () => {
  it('Leaves an unpadded string as-is', () => {
    expect(unpadHexString('0x1a')).toEqual('0x1a')
  })

  it('Removes a single zero padding', () => {
    expect(unpadHexString('0x0f')).toEqual('0xf')
  })

  it('Removes multiple zeroes', () => {
    expect(unpadHexString('0x000f')).toEqual('0xf')
  })

  it('Removes all zeroes from a zero value', () => {
    expect(unpadHexString('0x0000')).toEqual('0x')
  })
})
