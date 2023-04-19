import React from 'react'
import { useEffect } from 'react'
import { Web3Button } from '@web3modal/react'

const ConnectButton = ({ currentAddress }) => {

  useEffect(() => {}, [currentAddress])

  return (
    <Web3Button label="Connect Wallet" />
  )
}

export default ConnectButton