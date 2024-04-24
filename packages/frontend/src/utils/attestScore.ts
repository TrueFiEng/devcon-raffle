import { hashTypedData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const scoreAttestationVerifierAddress = process.env.SCORE_ATTESTATION_VERIFIER_ADDRESS as `0x${string}`
const attestor = privateKeyToAccount(process.env.SCORE_ATTESTOR_PRIVATE_KEY as string)

export async function attestScore(subject: string, score: bigint) {
  const typedData = {
    domain: {
      name: 'ScoreAttestationVerifier',
      version: '1',
      chainId: 31337, // TODO: Receive param from route
      verifyingContract: scoreAttestationVerifierAddress,
    },
    types: {
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
    },
    message: {
      subject,
      score,
    },
  }

  const digest = hashTypedData({
    ...typedData,
    primaryType: 'Score',
  })
  const signature = await attestor.signTypedData({
    ...typedData,
    primaryType: 'Score',
  })
  return {
    digest,
    signature,
  }
}
