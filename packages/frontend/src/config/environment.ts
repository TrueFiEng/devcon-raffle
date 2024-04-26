export const environment = {
  voucherRedeemDeadline: getDateEnv(process.env.NEXT_PUBLIC_VOUCHER_REDEEM_DEADLINE),
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
  infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY,
  gitcoinRequiredScore: Number(process.env.NEXT_PUBLIC_GITCOIN_REQUIRED_SCORE),
  gtcScorerApiBaseUri: process.env.GTC_SCORER_API_BASE_URI || 'https://api.scorer.gitcoin.co',
  // Get your scorer API & ID from https://scorer.gitcoin.co
  gtcScorerApiKey: process.env.GTC_SCORER_API_KEY as string,
  gtcScorerId: process.env.GTC_SCORER_ID as string,
  scoreAttestationVerifierAddress:
    process.env.SCORE_ATTESTATION_VERIFIER_ADDRESS || '0x0000000000000000000000000000000000000000',
  scoreAttestationVerifierVersion: process.env.SCORE_ATTESTATION_VERIFIER_VERSION || '1',
  scoreAttestorPrivateKey:
    process.env.SCORE_ATTESTOR_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000',
  voucherCodes: getVoucherCodes(),
}

function getDateEnv(envValue: string | undefined): number | undefined {
  return envValue ? Math.floor(new Date(envValue).getTime() / 1000) : undefined
}

function getVoucherCodes() {
  const voucherCodes = process.env.VOUCHER_CODES
  if (typeof voucherCodes === 'undefined') {
    throw new Error('VOUCHER_CODES not supplied!')
  }
  return voucherCodes.split(',')
}
