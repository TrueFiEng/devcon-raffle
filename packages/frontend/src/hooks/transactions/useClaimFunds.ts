import { BigNumber } from '@ethersproject/bignumber'
import { useEthers, useSendTransaction } from '@usedapp/core'

import { useDevconContract } from '../contract'

export function useClaimFunds() {
  const devconContract = useDevconContract()
  const { account, chainId } = useEthers()
  const { sendTransaction, state, resetState } = useSendTransaction({ transactionName: 'Claim' })

  async function claimFunds(bidderId: BigNumber) {
    if (!devconContract || !account || !chainId) {
      return
    }

    const tx = await devconContract.populateTransaction.claim(bidderId)
    await sendTransaction(tx)
  }

  return { claimFunds, state, resetState }
}
