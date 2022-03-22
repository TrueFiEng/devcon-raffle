import { id } from '@ethersproject/hash'
import { JsonRpcProvider, Log } from '@ethersproject/providers'
import { useEffect, useMemo, useState } from 'react'

const GANACHE_DEVCON6_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const FIRST_QUERIED_BLOCK = 0

export function useBidEvents() {
  const [events, setEvents] = useState<Log[]>([])
  const provider = useMemo(() => new JsonRpcProvider(), [])
  const [lastQueriedBlock, setLastQueriedBlock] = useState(FIRST_QUERIED_BLOCK)

  useEffect(() => {
    const fetch = setInterval(async () => {
      const fromBlock = lastQueriedBlock + 1
      const toBlock = (await provider.getBlock('latest')).number
      if (fromBlock < toBlock) {
        const logs = await provider.getLogs({
          address: GANACHE_DEVCON6_ADDRESS,
          topics: [id('NewBid(address,uint256,uint256)')],
          fromBlock,
          toBlock,
        })
        setLastQueriedBlock(toBlock)
        setEvents(events.concat(logs))
      }
    }, 10_000)
    return () => clearInterval(fetch)
  }, [])

  return events
}
