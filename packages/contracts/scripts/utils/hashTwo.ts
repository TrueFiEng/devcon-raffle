import { BytesLike } from '@ethersproject/bytes'
import { utils } from 'ethers'

export function hashTwo(first: BytesLike, second: BytesLike): string {
  const concat = utils.concat([first, second])
  return utils.keccak256(concat)
}
