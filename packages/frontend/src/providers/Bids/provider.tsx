import { Devcon6 } from '@devcon-raffle/contracts'
import { useBlockNumbers } from '@usedapp/core/internal'
import { Dispatch, ReactNode, useEffect, useReducer, useState } from 'react'
import { useChainId } from 'src/hooks/chainId/useChainId'
import { useDevconContract } from 'src/hooks/contract'
import { useReadOnlyProvider } from 'src/hooks/contract/useReadOnlyProvider'
import { useContractBids } from 'src/hooks/useContractBids'
import { Bid } from 'src/models/Bid'
import useAsyncEffect from 'use-async-effect'

import { BidsContext } from './context'
import { BidChanged, bidsReducer, getDefaultBidsState } from './reducer'

// TODO remove console logs

interface Props {
  children: ReactNode
}

export const BidsProvider = ({ children }: Props) => {
  const [bidsState, dispatch] = useReducer(bidsReducer, getDefaultBidsState())
  const contractBids = useContractBids()

  useEffect(() => {
    console.log(`Init bids, count: ${contractBids.length}`)
    initBids(contractBids, dispatch)
  }, [contractBids])

  const provider = useReadOnlyProvider()
  const chainId = useChainId()
  const [lastFetchedBlock, setLastFetchedBlock] = useState<number | undefined>(undefined)

  useAsyncEffect(
    async (isActive) => {
      const blockNumber = await provider.getBlockNumber()
      if (!isActive()) {
        return
      }
      console.log(`Setting latestFetchedBlock to ${blockNumber - 1}`)
      setLastFetchedBlock(blockNumber - 1)
    },
    () => {
      console.log('Chain changed, clearing lastFetchedBlock')
      setLastFetchedBlock(undefined)
    },
    [chainId]
  )

  const { devcon } = useDevconContract()
  const blockNumber = useBlockNumbers()[chainId]

  useEffect(() => {
    // TODO if blockNumber changes faster than queryFilter call returns an
    //  overlapping block range will be chosen, re-fetching some events unnecessarily.
    //  I suggest extracting a new reducer that will keep track of lastFetchedBlock
    //  and query as broad block range as possible.
    queryNewBids(devcon, blockNumber, lastFetchedBlock, setLastFetchedBlock, dispatch)
  }, [devcon, blockNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  return <BidsContext.Provider value={{ bidsState }}>{children}</BidsContext.Provider>
}

function initBids(contractBids: Bid[], dispatch: Dispatch<BidChanged>) {
  contractBids.forEach((bid) => dispatch(bid))
}

async function queryNewBids(
  devcon: Devcon6,
  currentBlock: number | undefined,
  lastFetchedBlock: number | undefined,
  setLastFetchedBlock: (value: number | undefined) => void,
  dispatch: Dispatch<BidChanged>
) {
  if (currentBlock === undefined || lastFetchedBlock === undefined) {
    console.log('Skipping fetch blocks are undefined')
    return
  }

  if (currentBlock <= lastFetchedBlock) {
    console.log(`Skipping fetch, currentBlock = ${currentBlock}, lastFetchedBlock = ${lastFetchedBlock}`)
    return
  }

  console.log(`Querying range: ${lastFetchedBlock + 1} - ${currentBlock}`)
  const eventFilter = devcon.filters.NewBid(null, null, null)
  const events = await devcon.queryFilter(eventFilter, lastFetchedBlock + 1, currentBlock)
  events.forEach((event) => {
    dispatch({
      bidderID: event.args.bidderID,
      bidderAddress: event.args.bidder,
      amount: event.args.bidAmount,
    })
  })
  setLastFetchedBlock(currentBlock)
}
