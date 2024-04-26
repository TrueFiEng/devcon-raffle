import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'
import { randomUUID } from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // GET /api/voucher/nonce
      // Get a nonce that a user must sign in order to get their voucher code
      return getVoucherNonce(req, res)
    default:
      res.status(405).end()
  }
}

export const GetVoucherNonceResponseSchema = z.object({
  nonce: z.string(),
})

export type GetVoucherNonceResponse = z.infer<typeof GetVoucherNonceResponseSchema>

export async function getVoucherNonce(_req: NextApiRequest, res: NextApiResponse) {
  const nonce = randomUUID()
  res.setHeader('Set-Cookie', `voucherNonce=${nonce}; sameSite=none; httpOnly=true; secure=true;`)
  const result: GetVoucherNonceResponse = {
    nonce,
  }
  res.status(200).json(result)
}
