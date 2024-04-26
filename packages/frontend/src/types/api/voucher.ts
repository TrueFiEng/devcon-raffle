import z from 'zod'
import { EthereumAddressSchema } from '../EthereumAddress'
import { HexStringSchema } from '../HexString'

export const GetVoucherNonceResponseSchema = z.object({
  nonce: z.string(),
})

export type GetVoucherNonceResponse = z.infer<typeof GetVoucherNonceResponseSchema>

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
