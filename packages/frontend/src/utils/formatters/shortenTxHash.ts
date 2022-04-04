export const shortenTxHash = (txHash: string) =>
  `${txHash.substring(0, 6)}......${txHash.substring(txHash.length - 12)}`
