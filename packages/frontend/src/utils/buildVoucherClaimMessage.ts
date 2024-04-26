/**
 * Build voucher claim message for EIP-191 signing
 */
export function buildVoucherClaimMessage(chainId: number, userAddress: `0x${string}`, nonce: string) {
  return `Claim voucher code for address ${chainId}:${userAddress}. Nonce: ${nonce}`
}
