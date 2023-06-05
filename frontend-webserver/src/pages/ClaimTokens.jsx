import React, { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import styles from "../style"
import { signMessage } from "@wagmi/core"
import LoadingPopup from "../components/Market/LoadingPopup"
import Alert from "../components/Market/Alert"
import {
  setAlert,
  setLoadingMsg,
} from "../components/Market/NotificationManagement"

const ClaimTokens = () => {
  const [earnings, setEarnings] = useState(0)
  let { address } = useAccount()

  const fetchMyEarnings = () => {
    fetch("http://193.219.91.103:6172/api/v1/marketplace/earnings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    })
      .then((response) => response.json())
      .then((earnings) => {
        const earningInPSD = (Number(earnings) / 10 ** 18) * 0.97
        setEarnings(earningInPSD)
      })
      .catch((err) => console.log(err))
  }

  const getNonce = () => {
    return fetch(`http://193.219.91.103:6172/api/v1/db/${address}/nonce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.text())
      .then((nonce) => nonce)
      .catch((err) => console.log(err))
  }

  const withdrawMyEarnings = async () => {
    try {
      let nonce = await getNonce()
      setLoadingMsg("Awaiting wallet signature approval...")
      const signature = await signMessage({
        message: `Withdraw earnings to connected account: ${address}\nnonce: ${nonce}`,
      })
      const requestedData = {
        signature: signature,
        address: address,
        action: `withdraw`,
      }
      fetch("http://193.219.91.103:6172/api/v1/marketplace/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestedData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.transactionHash) {
            setAlert("Transaction has been completed")
            setEarnings(0)
          }
        })
        .catch((err) => setAlert("Transaction has failed", "red"))
    } catch (err) {
      setAlert("Transaction has been canceled", "red")
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMyEarnings()
  }, [address])

  return (
    <div>
      {earnings === 0 ? (
        <div className={`${styles.flexCenter} flex-col h-[50vh]`}>
          <h3
            className={`${styles.flex} ${styles.heading2} w-full text-gold2 text-center`}
          >
            There are no tokens to be claimed.
          </h3>
        </div>
      ) : (
        <div className={`${styles.flexCenter} flex-col h-[50vh]`}>
          <h3
            className={`${styles.flex} ${styles.heading2} w-full text-gold2 text-center`}
          >
            You have earned: {earnings} PSD.
          </h3>
          <button
            className="background-gold text-white font-bold py-2 px-4 rounded"
            onClick={withdrawMyEarnings}
          >
            Claim Tokens
          </button>
        </div>
      )}
      <LoadingPopup />
      <Alert />
    </div>
  )
}

export default ClaimTokens
