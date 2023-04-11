import React from 'react'
import { useState, useEffect } from 'react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, useWeb3ModalTheme } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, localhost } from 'wagmi/chains'
import ConnectButton from '../components/ConnectButton'
import { setGlobalState, useGlobalState } from '.'
import RegisterPopup from '../components/RegisterPopup'
import $ from "jquery"


const chains = [mainnet, localhost]
const projectId = 'f20b37964af1371a005ca09bd341fb76'

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains)


const Market = () => {

  const { setTheme } = useWeb3ModalTheme()
  const [loaded, setLoaded] = useState(false)
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [currentAddress, setCurrentAddress] = useState('')
  const [existsValue, setExistsValue] = useState(null)
  
  
  useEffect(() => {
    const account = ethereumClient.getAccount()
    if (account.address) {
      setGlobalState('connectedAccount', account.address)
      setCurrentAddress(account.address)
      console.log(account.address)
    }

    // make async when user connect wallet you can load his nfts for example
    // function will execute even if wallet hasn't been changed, it will consider initial wallet address
    ethereumClient.watchAccount((account) => {
      if (account.address) {
        setGlobalState('connectedAccount', account.address)
        setCurrentAddress(account.address)
      } else {
        setGlobalState('connectedAccount', '')
        setCurrentAddress('')
        setExistsValue(null)
      }
    })

    setLoaded(true)
    // hook to execute only when the connectedAccount value changes
  }, [connectedAccount]) 

  // call sendAddress when the address value changes
  useEffect(() => {
    if (currentAddress) {
      sendAddress(currentAddress)
    }
  }, [currentAddress])

  // useEffect(() => {
  //   setTheme({
  //     themeColor: '#f5c31f',
  //     themeMode: 'light',
  //     themeBackgroundColor: 'themeColor',
  //   })
  // }, [])

  const sendAddress = async (address) => {
    let existsValue = ''
    try {
      const response = await $.ajax({
        type: 'POST',
        url: 'http://193.219.91.103:6172/api/v1/db/checkUser',
        data: { address },
      })
      existsValue = response.exists
      setExistsValue(existsValue)
      if (existsValue === true) {
        login(address)
      }
    } catch (error) {
      console.log(error)
    }
    console.log(existsValue)
    return existsValue
  }

  const register = async (address, username, data) => {
    try {
      const response = await $.ajax({
        type: 'POST',
        url: 'http://193.219.91.103:6172/api/v1/auth/register',
        data: { address, username, data },
      })
      console.log(response)
      Cookies.set('access_token', response.headers['set-cookie'])
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
        success: function(data, textStatus, request){
          console.log(request.getAllResponseHeaders());
        },
      })
      //console.log(response)
      
      //Cookies.set('access_token', response.headers['Set-Cookie'])
    } catch (error) {
      console.log(error)
    }
  }
    
  return (
    <>
    <WagmiConfig client={wagmiClient}>
      <div className="flex justify-center">
          <ConnectButton/>
      </div>
      {existsValue === false && <RegisterPopup onSubmit={register} currentAddress={currentAddress} />}
      {/* {existsValue === true && <LoginPopup onClick={login} currentAddress={currentAddress}/> } */}
    </WagmiConfig>

    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeVariables={{
        "--w3m-font-family": "Roboto, sans-serif",
        "--w3m-accent-color": "#f5c31f",
        "--w3m-background-color": "#f5c31f",
        // '--w3m-logo-image-url': ''
      }}
    />
  </>
  )
}

export default Market