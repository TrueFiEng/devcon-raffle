import { BigNumber } from '@ethersproject/bignumber'
import { useEthers, useSendTransaction } from '@usedapp/core'

import { useDevconContract } from '../contract'

export function useBid() {
  const devconContract = useDevconContract()
  const { account, chainId } = useEthers()
  const { sendTransaction, state, resetState } = useSendTransaction({ transactionName: 'Bid' })

  async function placeBid(bidAmount: BigNumber) {
    if (!account || !chainId) {
      return
    }

    const tx = await devconContract.populateTransaction.bid({ value: bidAmount })
    await sendTransaction(tx)
  }

  return { placeBid, state, resetState }
}
