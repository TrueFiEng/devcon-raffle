import { Interface } from '@ethersproject/abi'
import { id } from '@ethersproject/hash'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useMemo } from 'react'
import { DEVCON6_ABI } from 'src/constants/abis'
import { Bid } from 'src/models/Bid'

export async function useBidEvents() {
  const provider = useMemo(() => new JsonRpcProvider(), [])
  const bidsFromEvents = useMemo(async () => {
    const latest = await provider.getBlock('latest')
    const logs = await provider.getLogs({
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      topics: [id('NewBid(address,uint256,uint256)')],
      fromBlock: 0,
      toBlock: latest.number,
    })
    const abi = new Interface(DEVCON6_ABI)
    return logs.map((log) => {
      const event = abi.parseLog(log)
      const bid: Bid = { bidderAddress: event.args.bidder, amount: event.args.bidAmount }
      return bid
    })
  }, [provider])
  return bidsFromEvents.then((b) => b)
}
