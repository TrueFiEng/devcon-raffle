import { Bid } from './Auction'
import { utils } from 'ethers'

export const bids: Bid[] = [
  {
    bidderAddress: '0x6308fb2349Ca8Bf5D9Ab896Ea4AAc7B525febb13',
    amount: utils.parseEther('2.12312331231'),
  },
  {
    bidderAddress: '0x987847126f79303D74060F963c178174A162a662',
    amount: utils.parseEther('1'),
  },
  {
    bidderAddress: '0xEFD1f456674702F7C9aEE2886C0a078ed07da955',
    amount: utils.parseEther('0.1233312331231'),
  },
]
