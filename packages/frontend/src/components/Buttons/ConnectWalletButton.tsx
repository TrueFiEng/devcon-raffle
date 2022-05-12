import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import Portis from '@portis/web3'
import { useEthers } from '@usedapp/core'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { CONFIG } from 'src/config/config'
import { WALLET_CONNECT_BRIDGE_URL } from "src/constants/walletConnectBridgeUrl";
import { useDefaultNetwork } from 'src/hooks/chain/useDefaultNetwork'
import { useWhichWallet } from 'src/hooks/useWhichWallet'
import Web3Modal from 'web3modal'

import { Button, ButtonProps } from './Button'

type ConnectWalletButtonProps = Omit<ButtonProps, 'onClick' | 'children'>

export const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  const { activate } = useEthers()
  const { isBraveWallet } = useWhichWallet()
  const { chainName, chainId, rpcUrl } = useDefaultNetwork()

  const metamaskOptions = {
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
        options: coinbaseWalletOptions,
      },
    }

    const web3Modal = new Web3Modal({
      network: chainName === 'Arbitrum' ? 'arbitrum' : 'arbitrum-rinkeby',
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
