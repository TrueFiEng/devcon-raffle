import { Devcon6 } from '@devcon-raffle/contracts'
import { useBlockNumber, useEthers } from '@usedapp/core'
import { Dispatch, ReactNode, useEffect, useReducer } from 'react'
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
  const { devcon } = useDevconContract()
  const blockNumber = useBlockNumber()
  const {library} = useEthers()

  const [bidsState, dispatch] = useReducer(bidsReducer, getDefaultBidsState())
  useEffect(() => initBids(contractBids, dispatch), [contractBids, dispatch])

  useEffect(() => {
    console.log('on')
    const listener = (args: any) => {
      console.log(args)
    }
    library?.on('poll', listener)
    return () => {
      console.log('off')
      library?.off('poll', listener)
    }
  }, [library])

  useEffect(() => {
    console.log('interval: ', library?.pollingInterval)
    console.log('block number use effect, block number: ', blockNumber)
  }, [library, blockNumber])

  useEffect(() => {
    subscribeToNewBids(devcon, blockNumber, dispatch)
  }, [devcon, blockNumber])

  return <BidsContext.Provider value={{ bidsState }}>{children}</BidsContext.Provider>
}

function initBids(contractBids: Bid[], dispatch: Dispatch<BidChanged>) {
  contractBids.forEach((bid) => dispatch(bid))
}

async function subscribeToNewBids(devcon: Devcon6, blockNumber: number | undefined, dispatch: Dispatch<BidChanged>) {
  if (!blockNumber) {
    return
  }

  const eventFilter = devcon.filters.NewBid(null, null, null)
  const events = await devcon.queryFilter(eventFilter, blockNumber, blockNumber) // TODO we may skip blocks here
  events.forEach((event) => {
    console.log('found new bid')
    dispatch({
      bidderID: event.args.bidderID,
      bidderAddress: event.args.bidder,
      amount: event.args.bidAmount,
    })
  })
}
