import React from 'react'
import { useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { Web3Button } from '@web3modal/react'

const ConnectButton = ({ currentAddress }) => {

  useEffect(() => {}, [currentAddress])

  const { t } = useTranslation('NavBar')

  return (
    <Web3Button
      label={t("Wallet")}
    />
  )
}

export default ConnectButton