import Portis from '@portis/web3'
import { useEthers } from '@usedapp/core'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { CONFIG } from 'src/config/config'
import Web3Modal from 'web3modal'

import { Button, ButtonProps } from './Button'
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

type ConnectWalletButtonProps = Omit<ButtonProps, 'onClick' | 'children'>

export const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  const { activate } = useEthers()

  const metamaskOptions = {
    display: {
      name: (window.ethereum as any).isBraveWallet ? 'BraveWallet' : 'MetaMask',
      description: 'Connect with the provider in your Browser',
    },
    package: null,
  }

  const walletConnectOptions = {
    bridge: 'https://bridge.walletconnect.org',
    rpc: {
      [CONFIG.useDAppConfig.readOnlyChainId ?? 1]: CONFIG.useDAppConfig.networks?.[0].rpcUrl,
    },
  }

  const portisOptions = {
    network: {
      nodeUrl: CONFIG.useDAppConfig.networks?.[0].rpcUrl,
      chainId: CONFIG.useDAppConfig.readOnlyChainId,
    },
    id: CONFIG.portisDAppID,
  }

  const coinbaseWalletOptions = {
    appName: CONFIG.dappName,
    rpc: CONFIG.useDAppConfig.networks?.[0].rpcUrl,
    chainId: CONFIG.useDAppConfig.readOnlyChainId,
    darkMode: false
  }

  const activateProvider = async () => {
    const providerOptions = {
      injected: metamaskOptions,
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
        options: coinbaseWalletOptions
      },
    }

    const web3Modal = new Web3Modal({
      network: CONFIG.useDAppConfig.networks?.[0].chainName === 'Arbitrum' ? 'arbitrum' : 'arbitrum-rinkeby',
      providerOptions,
    })

    try {
      const provider = await web3Modal.connect()
      await activate(provider)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <Button {...props} onClick={activateProvider}>
      Connect Wallet
    </Button>
  )
}
