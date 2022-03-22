import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { EventFragment } from '@usedapp/core/node_modules/ethers/lib/utils'
import { DEVCON6_ABI } from 'src/constants/abis'

export function createMockBidLog(blockNumber: number, address: string, amount: string) {
  const abi = new Interface(DEVCON6_ABI)
  return {
    blockNumber,
    blockHash: '0x',
    transactionIndex: 0,
    removed: false,
    address: '0x',
    ...abi.encodeEventLog(EventFragment.from('NewBid(address bidder, uint256 bidID, uint256 bidAmount)'), [
      address,
      BigNumber.from(0),
      parseEther(amount),
    ]),
    transactionHash: '0x',
    logIndex: 0,
  }
}
