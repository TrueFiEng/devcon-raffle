import z from 'zod'

export const HexStringSchema = z.string().refine((arg): arg is `0x${string}` => /^0x([0-9a-fA-F]{2})*$/.test(arg))
