import { Devcon6 } from '@devcon-raffle/contracts'
import { Provider } from '@ethersproject/providers'
import { useBlockNumber } from '@usedapp/core'
import { Dispatch, ReactNode, useEffect, useReducer, useState } from 'react'
import { useDevconContract } from 'src/hooks/contract'
import { useContractBids } from 'src/hooks/useContractBids'
import { Bid } from 'src/models/Bid'

import { BidsContext } from './context'
import { BidChanged, bidsReducer, getDefaultBidsState } from './reducer'

interface Props {
  children: ReactNode
}

export const BidsProvider = ({ children }: Props) => {
  const contractBids = useContractBids()
  const { devcon, provider } = useDevconContract()
  const blockNumber = useBlockNumber()
  const [latestFetchedBlock, setLatestFetchedBlock] = useState(blockNumber)

  const [bidsState, dispatch] = useReducer(bidsReducer, getDefaultBidsState())

  useEffect(() => {
    initBids(contractBids, dispatch)
  }, [contractBids])

  useEffect(() => {
    setInitialBlockNumber(provider, setLatestFetchedBlock)
  }, [provider])

  useEffect(() => {
    queryNewBids(devcon, latestFetchedBlock, setLatestFetchedBlock, blockNumber, dispatch)
  }, [devcon, blockNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  return <BidsContext.Provider value={{ bidsState }}>{children}</BidsContext.Provider>
}

function initBids(contractBids: Bid[], dispatch: Dispatch<BidChanged>) {
  contractBids.forEach((bid) => dispatch(bid))
}

async function queryNewBids(
  devcon: Devcon6,
  latestFetchedBlock: number | undefined,
  setLatestFetchedBlock: (value: number | undefined) => void,
  toBlock: number | undefined,
  dispatch: Dispatch<BidChanged>
) {
  if (latestFetchedBlock === undefined || toBlock === undefined) {
    return
  }

  const eventFilter = devcon.filters.NewBid(null, null, null)
  const events = await devcon.queryFilter(eventFilter, latestFetchedBlock + 1, toBlock)
  events.forEach((event) => {
    dispatch({
      bidderID: event.args.bidderID,
      bidderAddress: event.args.bidder,
      amount: event.args.bidAmount,
    })
  })
  setLatestFetchedBlock(toBlock)
}

async function setInitialBlockNumber(provider: Provider, setLatestFetchedBlock: (value: number | undefined) => void) {
  const blockNumber = await provider.getBlockNumber()
  setLatestFetchedBlock(blockNumber)
}
