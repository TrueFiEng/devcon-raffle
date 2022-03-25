import { DEVCON6_ABI } from '../../constants/abis'
import { useAddresses } from '../useAddresses'

import { useContract } from './useContract'

export function useDevconContract() {
  const { devcon } = useAddresses('devcon')
  return useContract(devcon, DEVCON6_ABI)
}
