import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'
import { verifyMessage } from 'viem'
import { HexStringSchema } from '@/types/HexString'
import { EthereumAddressSchema } from '@/types/EthereumAddress'
import { getPublicClient } from '@/blockchain/publicClient'
import { AUCTION_ADDRESSES } from '@/blockchain/auctionAddresses'
import { AUCTION_ABI } from '@/blockchain/abi/auction'
import { WinType } from '@/blockchain/abi/WinType'
import { ContractState } from '@/blockchain/abi/ContractState'
import { environment } from '@/config/environment'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
    // GET /api/voucher
    // Get voucher code with signed JWT
    case 'POST':
      // POST /api/voucher
      // Submit a signature (of signed nonce) in order to get a voucher code
      return getVoucherWithSig(req, res)
    default:
      res.status(405).end()
  }
}

export const GetVoucherWithSigRequestSchema = z.object({
  chainId: z.number(),
  userAddress: EthereumAddressSchema,
  signature: HexStringSchema,
  nonce: z.string(),
})

export type GetVoucherWithSigRequest = z.infer<typeof GetVoucherWithSigRequestSchema>

export const GetVoucherResponseSchema = z.object({
  voucherCode: z.string(),
})

export type GetVoucherResponse = z.infer<typeof GetVoucherResponseSchema>

export async function getVoucherWithSig(req: NextApiRequest, res: NextApiResponse) {
  const reqParseResult = GetVoucherWithSigRequestSchema.safeParse(JSON.parse(req.body))
  if (!reqParseResult.success) {
    res.status(400).end()
    return
  }

  const { chainId, userAddress, signature, nonce } = reqParseResult.data
  const voucherNonce = req.cookies['voucherNonce']
  if (nonce !== voucherNonce) {
    res.status(401).end()
    return
  }
  // Spend nonce
  res.setHeader('Set-Cookie', 'voucherNonce=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT')

  const isValid = await verifyMessage({
    address: userAddress,
    signature,
    message: `Claim voucher code for address ${chainId}:${userAddress}. Nonce: ${nonce}`,
  })
  if (!isValid) {
    res.status(403).end() // TODO
    return
  }

  const client = getPublicClient(chainId)
  // Check if auction & raffle are settled
  const state = await client.readContract({
    address: AUCTION_ADDRESSES[chainId as keyof typeof AUCTION_ADDRESSES],
    abi: AUCTION_ABI,
    functionName: 'getState',
  })
  if (state !== ContractState.RAFFLE_SETTLED) {
    res.status(403).end() // TODO
    return
  }

  // Check if address was a winner
  const { bidderID } = await client.readContract({
    address: AUCTION_ADDRESSES[chainId as keyof typeof AUCTION_ADDRESSES],
    abi: AUCTION_ABI,
    functionName: 'getBid',
    args: [userAddress],
  })
  const winType = await client.readContract({
    address: AUCTION_ADDRESSES[chainId as keyof typeof AUCTION_ADDRESSES],
    abi: AUCTION_ABI,
    functionName: 'getBidWinType',
    args: [bidderID],
  })
  if (winType === WinType.LOSS) {
    res.status(403).end() // TODO
    return
  }

  // Get voucher code for address
  const auctionWinners = await client.readContract({
    address: AUCTION_ADDRESSES[chainId as keyof typeof AUCTION_ADDRESSES],
    abi: AUCTION_ABI,
    functionName: 'getAuctionWinners',
  })
  const raffleWinners = await client.readContract({
    address: AUCTION_ADDRESSES[chainId as keyof typeof AUCTION_ADDRESSES],
    abi: AUCTION_ABI,
    functionName: 'getRaffleWinners',
  })
  const winnerIndex = auctionWinners.concat(raffleWinners).findIndex((id) => id === bidderID)
  if (winnerIndex === -1) {
    // Invariant violation
    res.status(500).end() // TODO
    return
  }

  // All good
  const result: GetVoucherResponse = {
    voucherCode: environment.voucherCodes[winnerIndex],
  }
  res.status(200)
  res.setHeader('Set-Cookie', `jwt=${''}`)
  res.status(200).json(result)
}
