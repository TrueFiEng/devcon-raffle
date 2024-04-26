import z from 'zod'
import { EthereumAddressSchema } from '../EthereumAddress'
import { HexStringSchema } from '../HexString'

export const GetPassportScorerNonceSchema = z.object({
  message: z.string(),
  nonce: z.string(),
})

export type GetPassportScorerNonce = z.infer<typeof GetPassportScorerNonceSchema>

export const SubmitAddressForScoringRequestSchema = z.object({
  userAddress: z.string(),
  signature: z.string().regex(/^0x([0-9a-fA-F]{2})*$/),
  nonce: z.string(),
})

export type SubmitAddressForScoringRequest = z.infer<typeof SubmitAddressForScoringRequestSchema>

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
