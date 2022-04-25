import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { bidFactory, bidsStateFactory, ImmutableBidsState } from 'src/providers/Bids/types'
import { List as ImmutableList } from 'immutable'


export const mockBidsAddresses = [
  '0x0537a5C46D9719b8548d72c7175ad1fE30bD84EE',
  '0xF1443D0355cb50F2D8066Ae0475D63d031821345',
  '0xF320cC0B8cC869Fa2ff3D4215bc2acf80416a93F',
  '0xC1fE42438Dd1b693a3D63F1F0EEB994e4a97D707',
  '0xcAd96978aA3A23d2585CD2f53C2C49946e0a2f27',
  '0x1ad8041D9092D15A4b550b431B719d1Db61407eF',
  '0xfb552eff6e179645Ced8eC63b5F5A047A6dD7448',
  '0xe5d5433724c99dFdbA08cA560C0F471f919e96B9',
  '0x6e46606aa3860f4EeFa931F092fd65aBCa37417B',
  '0x13297B5E0FEd6Fa446A20f3ee09851CB9a5Df1b7',
  '0x3bcfa5327346B1C988c7cB7F97d975bBa18f5784',
  '0xFeB28aD6e2c27BDFc53CDfF470b3A25C77A19453',
  '0xDF2Bb1fdb1Ce4bDC15e879d9f90acffD49bC5E0B',
  '0xD88452Ab06f4c3Bb15E9cA7778387663096CCd0f',
  '0xF183D56A304496282E939a2df7b707A5832c36Ea',
  '0xDb31fC1ffc9c48329ccF6aD7Cea5C5CeC39eB326',
  '0x172311FF6E1b65035c7092AA053187870Bd10243',
  '0x6fF6eAE4550bB325d68ef2BDa261dc2670cD8463',
  '0x904d19ab8BFDB7B1b8AD025Ae72b034E1ad8AA49',
  '0x795AF44BDBa6e7078A7ee103F572bECB509Ebdff',
]

export function generateMockBidsState(howMany: number): ImmutableBidsState {
  let bidsState = bidsStateFactory({})
  for (let i = 0; i < howMany; i++) {
    bidsState = bidsState.set('bids', bidsState.bids.push(bidFactory({
      bidderID: BigNumber.from(i + 1),
      bidderAddress: mockBidsAddresses[i],
      place: i + 1,
      amount: parseEther(String(howMany - i)),
    })))
    bidsState = bidsState.set('bidders', bidsState.bidders.set(mockBidsAddresses[i], i))
  }
  return bidsState
}
