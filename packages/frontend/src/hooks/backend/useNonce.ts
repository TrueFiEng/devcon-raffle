import { useCallback, useState } from 'react'
import { CONFIG } from 'src/config/config'

export function useNonce(setError?: (e: string) => void) {
  const [nonce, setNonce] = useState<string | undefined>()
  const getNonce = useCallback(async () => {
    setNonce(undefined)
    try {
      const rawResponse = await fetch(CONFIG.backendUrl + '/nonces', {
        method: 'GET',
      })
      const response = await rawResponse.json()
      setNonce(response.nonce)
    } catch {
      setError?.('Could not retrieve message nonce.')
    }
  }, [setNonce, setError])
  return { nonce, getNonce }
}
