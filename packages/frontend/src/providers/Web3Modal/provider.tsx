import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import Portis from '@portis/web3'
import { useEthers } from '@usedapp/core'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ReactNode, useMemo } from 'react'
import { CONFIG } from 'src/config/config'
import { WALLET_CONNECT_BRIDGE_URL } from 'src/constants/walletConnectBridgeUrl'
import { useDefaultNetwork } from 'src/hooks/chain/useDefaultNetwork'
import { useWhichWallet } from 'src/hooks/useWhichWallet'
import useAsyncEffect from 'use-async-effect'
import Web3Modal from 'web3modal'

import { Web3ModalContext } from './context'

interface Props {
  children: ReactNode
}

export const Web3ModalProvider = ({ children }: Props) => {
  const { activate } = useEthers()
  const { isBraveWallet } = useWhichWallet()
  const { chainName, chainId, rpcUrl } = useDefaultNetwork()

  const injectedOptions = {
    display: {
      name: isBraveWallet ? 'BraveWallet' : 'MetaMask',
      description: 'Connect with the provider in your Browser',
    },
    package: null,
  }

  const walletConnectOptions = {
    bridge: WALLET_CONNECT_BRIDGE_URL,
    rpc: {
      [chainId]: rpcUrl,
    },
  }

  const portisOptions = {
    network: {
      nodeUrl: rpcUrl,
      chainId: chainId,
    },
    id: CONFIG.portisDAppID,
  }

  const coinbaseWalletOptions = {
    appName: CONFIG.dappName,
    rpc: rpcUrl,
    chainId: chainId,
    darkMode: false,
  }

  const providerOptions = {
    injected: injectedOptions,
    walletconnect: {
      package: WalletConnectProvider,
      options: walletConnectOptions,
    },
    portis: {
      package: Portis,
      options: portisOptions,
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: coinbaseWalletOptions,
    },
  }

  const web3Modal = useMemo(
    () =>
      new Web3Modal({
        network: chainName === 'Arbitrum' ? 'arbitrum' : 'arbitrum-rinkeby',
        cacheProvider: true,
        providerOptions,
      }),
    []
  )

  useAsyncEffect(async () => {
    if (web3Modal.cachedProvider) {
      const cachedProvider = await web3Modal.connect()
      await activate(cachedProvider)
    }
  }, [web3Modal])

  return <Web3ModalContext.Provider value={{ web3Modal }}>{children}</Web3ModalContext.Provider>
}
