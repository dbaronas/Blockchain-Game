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

  useEffect(() => {
    if (!selectedCard || selectedCard === null) {
      navigateTo("/marketplace/mylistings", { replace: true })
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

  const getNonce = () => {
    return fetch(
      `${import.meta.env.VITE_BACKEND}/api/v1/db/${walletAddress}/nonce`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.text())
      .then((nonce) => nonce)
      .catch((err) => err)
  }

  const cancelNFTListing = async () => {
    try {
      const nonce = await getNonce()
      setLoadingMsg("Awaiting wallet signature approval...")
      const signature = await signMessage({
        message: `Cancel NFT listing of connected account: ${walletAddress}\nnonce: ${nonce}`,
      })
      const requestedData = {
        signature: signature,
        address: walletAddress.toString(),
        action: 'cancel',
        listingId: parseInt(listingId),
      }
      fetch(`${import.meta.env.VITE_BACKEND}/api/v1/marketplace/cancelListing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestedData),
      })
        .then((response) => response.json())
        .then((receipt) => {
          if (receipt) {
            setAlert("Transaction has been completed")
            setTimeout(() => {
              navigateTo("/marketplace/mylistings")
            }, 2000)
          }
        })
        .catch((err) => setAlert("Transaction has failed", "red"))
    } catch (err) {
      setAlert("Transaction has been canceled", "red")
    }
  }

  return (
    <div className="text-white flex flex-row p-3 justify-center items-center max-[700px]:flex-col">
      <div className="basis-2/6 p-2 max-[700px]:flex max-[700px]:justify-center max-[700px]:items-center">
        <img
          src={image}
          alt={name}
          className="max-[700px]:w-2/3 lg:w-10/12 w-full shadow-yellow-500 border-2 rounded-lg shadow-lg border-yellow-500"
        />
      </div>
      <div className="flex flex-col gap-4 items-center justify-center basis-3/6 p-3">
        <h1 className="text-gold2 font-vt323 font-normal text-[1.5rem] lg:text-[1.8rem]">
          <i className="fa fa-check-circle text-gold3 p-1 text-[1rem]"></i>MetaOcean
        </h1>
        <p className="lg:text-[1.2rem]">Listing ID: #{listingId}</p>
        <p className="lg:text-[1.2rem]">
          Owned by <span className="text-gold3">{walletAddress}</span>
        </p>
        <p className="lg:text-[1.2rem]">Price: {price} PSD</p>
        <div className="lg:text-[1.2rem] flex justify-center flex-col border border-yellow-500 gap-3 rounded-lg shadow-yellow-500 shadow-md">
          <p className="text-gold3 border border-yellow-500 p-2">
            <i className="fas fa-align-justify pr-2 pb-2 text-gold3"></i>
            Description
          </p>
          <p className="p-2">{description}</p>
          {fishing_speed && (
            <p className="pl-2 pb-2 lg:text-[1.2rem]">Fishing speed: {fishing_speed}</p>
          )}
        </div>
        {isOwner && (
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
        )}
      </div>
      {showUpdatePricePopup && (
        <UpdatePricePopup
          onClose={() => setShowUpdatePricePopup(false)}
          walletAddress={walletAddress}
          listingId={listingId}
          quantity={quantity}
        />
      )}
      <LoadingPopup/>
      <Alert/>
    </div>
  )
}

export default MyListingDetails
