import z from 'zod'

export const environment = {
  voucherRedeemDeadline: getDateEnv(process.env.NEXT_PUBLIC_VOUCHER_REDEEM_DEADLINE),
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
  infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY,
  gitcoinRequiredScore: Number(process.env.NEXT_PUBLIC_GITCOIN_REQUIRED_SCORE),
  gtcScorerApiBaseUri: getStringEnv('GTC_SCORER_API_BASE_URI', 'https://api.scorer.gitcoin.co'),
  // Get your scorer API & ID from https://scorer.gitcoin.co
  gtcScorerApiKey: getStringEnv('GTC_SCORER_API_KEY'),
  gtcScorerId: getStringEnv('GTC_SCORER_ID'),
  scoreAttestationVerifierAddress: getStringEnv(
    'SCORE_ATTESTATION_VERIFIER_ADDRESS',
    '0x0000000000000000000000000000000000000000',
  ),
  scoreAttestationVerifierVersion: getStringEnv('SCORE_ATTESTATION_VERIFIER_VERSION', '1'),
  scoreAttestorPrivateKey: getStringEnv(
    'SCORE_ATTESTOR_PRIVATE_KEY',
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ),
}

function getDateEnv(envValue: string | undefined): number | undefined {
  return envValue ? new Date(Number(envValue)).getTime() / 1000 : undefined
}

function getStringEnv(key: string, defaultValue?: string) {
  return getEnv(key, z.string(), defaultValue)
}

function getEnv<T>(key: string, parser: z.Schema<T>, defaultValue?: T): T {
  const envValue = process.env[key]
  if (typeof envValue !== 'undefined') {
    return parser.parse(envValue)
  }
  if (defaultValue) {
    return defaultValue
  }
  throw new Error(`No env variable or defaults specified for ${key}`)
}
