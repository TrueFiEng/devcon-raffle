export function detectMetaMask() {
  const { web3, ethereum } = window as any
  if (!ethereum && !web3) return false
  return ethereum?.isMetaMask || web3?.currentProvider?.isMetaMask
}
