import { useContext, useEffect, useState } from "react"
import { MarketContext } from "./MarketContext"
import { useNavigate } from "react-router-dom"
import { useAccount } from "wagmi"
import UpdatePricePopup from "./UpdatePricePopup"
import { signMessage } from "@wagmi/core"
import LoadingPopup from "./LoadingPopup"
import Alert from "./Alert"
import { setAlert, setLoadingMsg } from "./NotificationManagement"

const MyListingDetails = () => {
  const { selectedCard } = useContext(MarketContext)
  const navigateTo = useNavigate()
  let { address } = useAccount()
  const [isOwner, setIsOwner] = useState(false)
  const [showUpdatePricePopup, setShowUpdatePricePopup] = useState(false)
  const isMarket = true

  useEffect(() => {
    if (!selectedCard || selectedCard === null) {
      navigateTo("/marketplace", { replace: true })
    }
  }, [selectedCard, navigateTo])

  useEffect(() => {
    if (selectedCard && selectedCard.walletAddress === address) {
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }
  }, [selectedCard, address])

  const showUpdateListingPricePopup = () => {
    setShowUpdatePricePopup(true)
  }

  if (!selectedCard || selectedCard === null) {
    return <div>Loading...</div>
  }

  const {
    listingId,
    walletAddress,
    tokenId,
    quantity,
    price,
    image,
    name,
    description,
    fishing_speed,
  } = selectedCard

  const getBuyerPSDBalance = () => {
    return fetch("http://193.219.91.103:6172/api/v1/20/PSDbalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({address}),
    })
      .then((response) => response.json())
      .then((balance) => Number(balance) / 10 ** 18)
      .catch((err) => console.log(err))
  }

  const getNonceOwner = () => {
    return fetch(
      `http://193.219.91.103:6172/api/v1/db/${walletAddress}/nonce`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.text())
      .then((nonce) => nonce)
      .catch((err) => console.log(err))
  }

  const getNonceBuyer = () => {
    return fetch(`http://193.219.91.103:6172/api/v1/db/${address}/nonce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.text())
      .then((nonce) => nonce)
      .catch((err) => console.log(err))
  }

  const buyNFT = async () => {
    try {
      const buyerBalance = await getBuyerPSDBalance()
      if (Number(price) > buyerBalance) {
        setAlert("Insufficient PSD balance for transaction", 'red')
        return
      }
      let nonce = await getNonceBuyer()
      console.log(nonce)
      setLoadingMsg("Awaiting wallet signature approval...")
      const signature = await signMessage({
        message: `Buy NFT to connected account: ${address}\nnonce: ${nonce}`,
      })
      const requestedData = {
        signature: signature,
        address: `${address.toString()}`,
        action: "buy",
        listingId: parseInt(listingId),
      }
      fetch("http://193.219.91.103:6172/api/v1/marketplace/buyNFT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestedData),
      })
        .then((response) => response.json())
        .then((receipt) => {
          if (receipt) {
            setAlert("Transaction has been completed")
            setTimeout(() => {
              navigateTo("/marketplace")
            }, 2000)
          }
        })
        .catch((err) => setAlert("Transaction has failed", "red"))
    } catch (err) {
      setAlert("Transaction has been canceled", "red")
      console.log(err)
    }
  }

  const cancelNFTListing = async () => {
    try {
      let nonce = await getNonceOwner()
      console.log(nonce)
      setLoadingMsg("Awaiting wallet signature approval...")
      const signature = await signMessage({
        message: `Cancel NFT listing of connected account: ${walletAddress}\nnonce: ${nonce}`,
      })
      const requestedData = {
        signature: signature,
        address: walletAddress.toString(),
        action: "cancel",
        listingId: parseInt(listingId),
      }
      fetch("http://193.219.91.103:6172/api/v1/marketplace/cancelListing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestedData),
      })
        .then((response) => response.json())
        .then((receipt) => {
          if (receipt) {
            setAlert("Transaction has been completed")
            setTimeout(() => {
              navigateTo("/marketplace")
            }, 2000)
          }
        })
        .catch((err) => setAlert("Transaction has failed", "red"))
    } catch (err) {
      setAlert("Transaction has been canceled", "red")
      console.log(err)
    }
  }

  return (
    <div className="text-white flex flex-row p-3 justify-center items-center">
      <div className="basis-2/6 p-2">
        <img
          src={image}
          alt={name}
          className="w-full shadow-yellow-500 border-2 rounded-lg shadow-lg border-yellow-500"
        />
      </div>
      <div className="flex flex-col gap-4 items-center justify-center basis-3/6 p-3">
        <h1 className="text-gold2 font-vt323 font-normal text-[1.5rem]">
          <i className="fa fa-check-circle text-gold3 p-1 text-[1rem]"></i>
          MetaOcean
        </h1>
        <p>Listing ID: #{listingId}</p>
        <p>
          Owned by <span className="text-gold3">{walletAddress}</span>
        </p>
        <p>Price: {price} PSD</p>
        <div className="flex justify-center flex-col border border-yellow-500 gap-3 rounded-lg shadow-yellow-500 shadow-md">
          <p className="text-gold3 border border-yellow-500 p-2">
            <i className="fas fa-align-justify pr-2 pb-2 text-gold3"></i>
            Description
          </p>
          <p className="p-2">{description}</p>
          {fishing_speed && (
            <p className="pl-2 pb-2">Fishing speed: {fishing_speed}</p>
          )}
        </div>
        {isOwner ? (
          <div className="flex">
            <button
              className="w-1/2 background-gold text-white font-bold py-2 px-4 rounded mr-2"
              onClick={showUpdateListingPricePopup}
            >
              Update Price
            </button>
            <button
              className="w-1/2 background-gold text-white font-bold py-2 px-4 rounded"
              onClick={cancelNFTListing}
            >
              Cancel Listing
            </button>
          </div>
        ) : (
          <button
            className="w-1/3 background-gold text-white font-bold py-2 px-4 rounded"
            onClick={buyNFT}
          >
            Buy
          </button>
        )}
      </div>
      {showUpdatePricePopup && (
        <UpdatePricePopup
          onClose={() => setShowUpdatePricePopup(false)}
          walletAddress={walletAddress}
          listingId={listingId}
          quantity={quantity}
          isMarket={isMarket}
        />
      )}
      <LoadingPopup />
      <Alert />
    </div>
  )
}

export default MyListingDetails
