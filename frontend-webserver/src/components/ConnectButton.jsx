import React from 'react'
import { useEffect } from 'react'
import { useGlobalState } from '../pages'
import { Web3Button } from '@web3modal/react'

const ConnectButton = () => {

  const [connectedAccount] = useGlobalState('connectedAccount')
  useEffect(() => {}, [connectedAccount])

  return (
    <Web3Button label="Connect Wallet" />
  )
}

export default ConnectButton