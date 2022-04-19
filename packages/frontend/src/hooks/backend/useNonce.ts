import { useCallback, useState } from 'react'
import { CONFIG } from 'src/config/config'

export function useNonce(setError: (e: string) => void) {
  const [nonce, setNonce] = useState<string | undefined>()
  const getNonce = useCallback(async () => {
    setNonce(undefined)
    const response = await fetch(CONFIG.backendUrl + '/nonces', {
      method: 'GET',
    })
      .then((response) => response.json())
      .catch(() => {
        setError('Could not retrieve message nonce.')
      })
    setNonce(response.nonce)
  }, [setNonce])
  return { nonce, getNonce }
}
