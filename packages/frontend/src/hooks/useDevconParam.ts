import { AuctionRaffle } from '@devcon-raffle/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { ContractMethodNames } from '@usedapp/core/dist/esm/src/model/types'
import { useMemo } from 'react'
import { useDevconContract } from 'src/hooks/contract'
import { useCachedCall } from 'src/hooks/useCachedCall'

export function useDevconParam(contractMethod: ContractMethodNames<AuctionRaffle>) {
  const { devcon, chainId } = useDevconContract()
  const { value, error } =
    useCachedCall(
      {
        contract: devcon,
        method: contractMethod,
        args: [],
      },
      chainId
    ) ?? {}

  const devconValue = useMemo(() => value && BigNumber.from(value[0]), [value])
  return { devconValue, error }
}
