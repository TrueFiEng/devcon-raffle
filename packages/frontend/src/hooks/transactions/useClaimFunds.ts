import { BigNumber } from '@ethersproject/bignumber'
import { useEthers, useSendTransaction } from '@usedapp/core'
import { useDevconContract } from 'src/hooks/contract'

export function useClaimFunds() {
  const { devcon } = useDevconContract()
  const { account, chainId } = useEthers()
  const { sendTransaction, state, resetState } = useSendTransaction({ transactionName: 'Claim' })

  async function claimFunds(bidderId: BigNumber) {
    if (!account || !chainId) {
      return
    }

    const tx = await devcon.populateTransaction.claim(bidderId)
    await sendTransaction(tx)
  }

  return { claimFunds, state, resetState }
}
