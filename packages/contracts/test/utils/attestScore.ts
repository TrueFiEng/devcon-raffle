import { BigNumberish, Wallet } from 'ethers'
import { _TypedDataEncoder, solidityPack, splitSignature } from 'ethers/lib/utils'

export interface AttestScoreOptions {
  version?: string
  chainId?: string
}

export async function attestScore(
  subject: string,
  score: BigNumberish,
  attestor: Wallet,
  scoreAttestationVerifierAddress: string,
  opts: AttestScoreOptions = {}
) {
  const version = opts.version || '1'
  const chainId = opts.chainId || '31337'
  const domain = {
    name: 'ScoreAttestationVerifier',
    version,
    chainId,
    verifyingContract: scoreAttestationVerifierAddress,
  }
  const types = {
    // Score(address subject,uint256 score)
    Score: [
      {
        name: 'subject',
        type: 'address',
      },
      {
        name: 'score',
        type: 'uint256',
      },
    ],
  }
  const values = {
    subject,
    score,
  }

  const digest = _TypedDataEncoder.hash(domain, types, values)
  const signature = await attestor._signTypedData(domain, types, values)
  return {
    digest,
    signature,
  }
}
