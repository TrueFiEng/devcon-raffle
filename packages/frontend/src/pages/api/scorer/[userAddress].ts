import { EthereumAddressSchema } from '@/types/EthereumAddress'
import { attestScore } from '@/utils/attestScore'
import log from '@/utils/log'
import type { NextApiRequest, NextApiResponse } from 'next'
import { environment } from '@/config/environment'
import z from 'zod'
import { HexStringSchema } from '@/types/HexString'

const ErrorResponseSchema = z.object({
  status: z.literal('error'),
  error: z.string(),
})

const GetScoreResponseProcessingSchema = z.object({
  status: z.literal('processing'),
})

const GetScoreResponseSuccessSchema = z.object({
  status: z.literal('done'),
  address: EthereumAddressSchema,
  score: z.string().regex(/^[0-9]+$/) /** serialised bigint */,
  digest: HexStringSchema /** EIP-712 digest */,
  signature: HexStringSchema,
})

const GetResponseSchema = z.union([
  ErrorResponseSchema,
  GetScoreResponseProcessingSchema,
  GetScoreResponseSuccessSchema,
])

export type GetScoreResponse = z.infer<typeof GetResponseSchema>

const gtcScorerId = environment.gtcScorerId
const gtcScorerApiBaseUri = environment.gtcScorerApiBaseUri
const gtcScorerApiKey = environment.gtcScorerApiKey

// GET /api/scorer/[userAddress]
// Get [userAddress]'s passport score (might still be processing). Score must be submitted first.
export default async function handler(req: NextApiRequest, res: NextApiResponse<GetScoreResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const userAddress = EthereumAddressSchema.parse(req.query.userAddress)
  let gtcResponse
  try {
    gtcResponse = await fetch(new URL(`/registry/v2/score/${gtcScorerId}/${userAddress}`, gtcScorerApiBaseUri).href, {
      headers: {
        'X-API-KEY': gtcScorerApiKey,
      },
    }).then((response) => response.json())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // The scorer will return a 400 when the score has not been submitted for querying
    if (err.response?.data?.detail?.startsWith('Unable to get score')) {
      res.status(500).json({
        status: 'error',
        error: `Unable to get score for ${userAddress}. Submit the score before querying.`,
      })
    } else {
      log.error(err)
      res.status(500).json({
        status: 'error',
        error: 'Internal server error',
      })
    }
    return
  }

  // Parse && sum stamp scores
  const { error, address, stamp_scores, status } = gtcResponse
  const rawScore = stamp_scores
    ? Object.values(stamp_scores)
        .map((value) => {
          if (typeof value !== 'number') {
            return 0
          }
          return value
        })
        .reduce((p, c) => p + c, 0)
    : 0

  if (error) {
    log.error(error)
    res.status(500).json({
      status: 'error',
      error,
    })
  } else if (status === 'PROCESSING' || status === 'BULK_PROCESSING') {
    res.status(202).json({
      status,
    })
  } else {
    // `rawScore` is delivered as a floating point number, between 0 and 100 inclusive
    // Scale up to 8 decimals to be encoded as uint256
    const score = BigInt(Math.floor(rawScore * 10 ** 8))
    // Sign EIP-712 attestation
    const { digest, signature } = await attestScore(address, score)
    const result: GetScoreResponse = {
      status,
      address,
      score: String(score),
      digest,
      signature,
    }
    res.status(200).send(result)
  }
}
