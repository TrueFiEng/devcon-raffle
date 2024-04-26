import { environment } from '@/config/environment'
import log from '@/utils/log'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      // POST /api/scorer
      // Submit a user's address, with their signature, to passport for scoring
      return submitAddressForScoring(req, res)
    default:
      res.status(405).end()
  }
}

const SubmitAddressForScoringRequestSchema = z.object({
  userAddress: z.string(),
  signature: z.string().regex(/^0x([0-9a-fA-F]{2})*$/),
  nonce: z.string(),
})

export type SubmitAddressForScoringRequest = z.infer<typeof SubmitAddressForScoringRequestSchema>

export async function submitAddressForScoring(req: NextApiRequest, res: NextApiResponse) {
  let gtcResponse
  try {
    const requestBody = SubmitAddressForScoringRequestSchema.parse(req.body)
    gtcResponse = await fetch(new URL('/registry/v2/submit-passport', environment.gtcScorerApiBaseUri).href, {
      method: 'POST',
      headers: {
        'X-API-KEY': environment.gtcScorerApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scorer_id: environment.gtcScorerId,
        address: requestBody.userAddress,
        signature: requestBody.signature,
        nonce: requestBody.nonce,
      }),
    }).then((result) => result.json())
  } catch (err) {
    log.error(err)
    res.status(500).end()
    return
  }
  if (gtcResponse.error) {
    log.error(gtcResponse.error)
    res.status(500).end()
  } else {
    res.status(200).end()
  }
}
