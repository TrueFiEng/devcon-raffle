import { Provider } from '@ethersproject/providers'

export async function getLatestBlockTimestamp(provider: Provider) {
  const block = await provider.getBlock('latest')
  return block.timestamp
}
