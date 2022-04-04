import { id } from '@ethersproject/hash'
import { JsonRpcProvider, Log } from '@ethersproject/providers'
import { useEffect, useMemo, useState } from 'react'
import 'react'
import { useAsync } from 'react-async-hook'

const GANACHE_DEVCON6_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const FIRST_QUERIED_BLOCK = 0
const POLL_INTERVAL = 10_000

export function useBidEvents() {
  const [events, setEvents] = useState<Log[]>([])
  const provider = useMemo(() => new JsonRpcProvider(), [])
  const [lastQueriedBlock, setLastQueriedBlock] = useState(FIRST_QUERIED_BLOCK)
  const { loading, result, execute, error } = useAsync(fetchEvents, [provider, FIRST_QUERIED_BLOCK])
  useEffect(() => {
    if (loading) {
      return
    }
    if (error) {
      console.error(error)
      setTimeout(() => execute(provider, lastQueriedBlock), POLL_INTERVAL)
    }
    if (result) {
      setEvents((events) => events.concat(result.logs))
      setLastQueriedBlock(result.lastQueriedBlock)
      setTimeout(() => execute(provider, result.lastQueriedBlock), POLL_INTERVAL)
    }
  }, [loading, result, error, execute])

  return events
}

async function fetchEvents(provider: JsonRpcProvider, lastQueriedBlock: number) {
  let logs: Log[] = []
  const fromBlock = lastQueriedBlock + 1
  const toBlock = (await provider.getBlock('latest')).number
  if (fromBlock <= toBlock) {
    logs = await provider.getLogs({
      address: GANACHE_DEVCON6_ADDRESS,
      topics: [id('NewBid(address,uint256,uint256)')],
      fromBlock,
      toBlock,
    })
  }
  return { logs, lastQueriedBlock: toBlock }
}
