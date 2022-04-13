export function getStringEnv(key: string): string | undefined {
  const env = import.meta.env[key]
  if (typeof env === 'string' && env !== '') {
    return env
  }
  return undefined
}
