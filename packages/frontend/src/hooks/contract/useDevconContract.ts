import { useEthers } from '@usedapp/core'
import { useAddresses } from '../useAddresses'
import {Devcon6, Devcon6Json} from '@devcon-raffle/contracts'
import {Contract, utils } from 'ethers'

export function useDevconContract() {
  const { devcon } = useAddresses('devcon')
  const { library } = useEthers()

  if (!library) {
    return undefined
  }

  const devconInterface = new utils.Interface(Devcon6Json)
  return new Contract(devcon, devconInterface) as Devcon6
}
