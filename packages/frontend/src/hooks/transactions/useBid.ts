import { BigNumber } from '@ethersproject/bignumber'
import { useSendTransaction } from '@usedapp/core'

import { useDevconContract } from '../contract'

export function useBid() {
  const devconContract = useDevconContract()
  const { sendTransaction, state } = useSendTransaction({ transactionName: 'Bid' })

  async function placeBid(bidAmount: BigNumber) {
    if (!devconContract) {
      return
    }

    const tx = await devconContract.populateTransaction.bid({ value: bidAmount })
    await sendTransaction(tx)
  }

  return { placeBid, state }
}
