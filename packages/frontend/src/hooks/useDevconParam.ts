import { Devcon6 } from '@devcon-raffle/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { useCall } from '@usedapp/core'
import { ContractMethodNames } from '@usedapp/core/dist/esm/src/model/types'

import { useDevconContract } from './contract'

export function useDevconParam(contractMethod: ContractMethodNames<Devcon6>) {
  const devconContract = useDevconContract()
  const { value, error } =
    useCall(
      devconContract && {
        contract: devconContract,
        method: contractMethod,
        args: [],
      }
    ) ?? {}
  const devconValue = value && BigNumber.from(value[0])
  return { devconValue, error }
}
