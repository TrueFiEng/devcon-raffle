import { useCallback, useState } from 'react'
import { CONFIG } from 'src/config/config'

export function useNonce() {
  const [nonce, setNonce] = useState<string | undefined>()
  const getNonce = useCallback(async () => {
    setNonce(undefined)
    const response = await fetch(CONFIG.backendUrl + '/nonces', {
      method: 'GET',
    }).then((response) => response.json())
    setNonce(response.nonce)
  }, [setNonce])
  return { nonce, getNonce }
}
