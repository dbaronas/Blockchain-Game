import React, { useState, useEffect } from 'react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, localhost } from 'wagmi/chains'
import ConnectButton from '../components/ConnectButton'
import RegisterPopup from '../components/RegisterPopup'
import $ from "jquery"


const chains = [mainnet, localhost]
const projectId = 'f20b37964af1371a005ca09bd341fb76'

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 2, chains }),
  provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains)


const Authentication = () => {

  const [currentAddress, setCurrentAddress] = useState('')
  const [walletExists, setWalletExists] = useState(null)
  
  useEffect(() => {
    
    // This function will be triggered primarily when when component mounts
    const account = ethereumClient.getAccount()
    if (account.address) {
      setCurrentAddress(account.address)
    }

    // This function only observes changes to the account
    ethereumClient.watchAccount((account) => {
      if (account.address) {
        setCurrentAddress(account.address)
      } else {
        setCurrentAddress('')
        setWalletExists(null)
      }
    })

    // a hook to execute only when the currentAddress value changes
  }, [currentAddress]) 


  // call a function sendAddress every time when the address value changes
  useEffect(() => {
    if (currentAddress) {
      checkIfAddressExists(currentAddress)
    }
  }, [currentAddress])

  const checkIfAddressExists = async (address) => {
    const type = "wallet_address"
    const data = {type: type, data: address}
    try {
      const response = await $.ajax({
        type: 'POST',
        url: 'http://193.219.91.103:6172/api/v1/db/checkUser',
        data: JSON.stringify(data),
        contentType: 'application/json',
      })
      setWalletExists(response.exists)
      console.log(response.exists)
      if (response.exists === true) {
        login(address)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const register = async (address, username, data) => {
    try {
      const response = await $.ajax({
        type: 'POST',
        url: 'http://193.219.91.103:6172/api/v1/auth/register',
        data: { address, username, data },
        xhrFields: { withCredentials: true },
        crossDomain: true,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const login = async (address) => {
    try {
      const response = await $.ajax({
        type: 'POST',
        url: 'http://193.219.91.103:6172/api/v1/auth/login',
        data: { address },
        xhrFields: { withCredentials: true },
        crossDomain: true,
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
    <WagmiConfig client={wagmiClient}>
      <div className="flex justify-center">
          <ConnectButton currentAddress={currentAddress}/>
      </div>
      {walletExists === false && <RegisterPopup onSubmit={register} currentAddress={currentAddress}/>}
    </WagmiConfig>

    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeVariables={{
        "--w3m-font-family": "Roboto, sans-serif",
        "--w3m-accent-color": "#f5c31f",
        "--w3m-background-color": "#f5c31f",
      }}
    />
  </>
  )
}

export default Authentication