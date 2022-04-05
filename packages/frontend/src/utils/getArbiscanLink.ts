export function getArbiscanTxLink(id: string | undefined) {
  if (!id) {
    return ''
  }
  return `https://arbiscan.io/tx/${id}`
}

export function getArbiscanAddressLink(address: string | undefined) {
  return `https://arbiscan.io/address/${address}`
}
