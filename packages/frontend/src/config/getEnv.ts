export function getStringEnv(key: string): string | undefined {
  const env = import.meta.env[key]
  if (typeof env === 'string' && env !== '') {
    return env
  }
  return undefined
}

export function getDateEnv(key: string): Date | undefined {
  const dateString = getStringEnv(key)
  if (dateString !== undefined) {
    return new Date(dateString)
  }
}
