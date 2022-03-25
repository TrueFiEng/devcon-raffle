import { BigNumber } from '@ethersproject/bignumber'
import { useSendTransaction } from '@usedapp/core'

import { useDevconContract } from '../contract'

export function useClaimFunds() {
  const devconContract = useDevconContract()
  const { sendTransaction, state } = useSendTransaction({ transactionName: 'Bid' })

  async function claimFunds(bidderId: BigNumber) {
    if (!devconContract) {
      return
    }

    const tx = await devconContract.populateTransaction.claim(bidderId)
    await sendTransaction(tx)
  }

  return { claimFunds, state }
}
