import { parseEther } from '@ethersproject/units'

export const mockBids = [
  {
    place: 1,
    bidderAddress: '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f',
    amount: parseEther('2.0'),
  },
  {
    place: 2,
    bidderAddress: '0x976ea74026e726554db657fa54763abd0c3a0aa9',
    amount: parseEther('1.0'),
  },
  {
    place: 3,
    bidderAddress: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
    amount: parseEther('0.5'),
  },
  {
    place: 4,
    bidderAddress: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
    amount: parseEther('0.5'),
  },
]
