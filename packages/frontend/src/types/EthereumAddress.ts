import z from 'zod'
import { getAddress, isAddress, Address } from 'viem'

export const EthereumAddressSchema = z.string().refine((arg): arg is Address => isAddress(getAddress(arg)))
